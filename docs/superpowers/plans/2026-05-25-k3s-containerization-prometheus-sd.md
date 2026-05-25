# k3s Containerization & Prometheus Dynamic Discovery — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Containerize the Bestande Node.js app on a self-managed k3s cluster across two VMs and migrate Prometheus to dynamic pod-annotation-based service discovery.

**Architecture:** k3s control plane on VM1, worker on VM2. App runs as a 2-replica Deployment (one pod per node via hard anti-affinity). Nginx and the full monitoring stack remain bare-metal. Prometheus gains k3s API access via a dedicated ServiceAccount kubeconfig to discover app pods dynamically.

**Tech Stack:** k3s, Docker (for image build), containerd (`k3s ctr`), kubectl, Kubernetes YAML manifests, Prometheus `kubernetes_sd_configs`, envsubst, ts-node-dev (dev server, no compilation step).

**Prerequisites:**
- SSH access to VM1 (nginx-instance1) and VM2 (172.23.205.204) with sudo
- Docker installed on the machine where you build the image (VM1 or local)
- The actual nginx site config path on VM1 (find with `nginx -T 2>/dev/null | grep "# configuration file"`)
- All current secret values for the k8s Secret (MONGODB_URI, SECRET_KEY, JWT_SECRET_KEY, AWS keys, ALGOLIA key — retrieve from the running app's environment on VM1/VM2 with `sudo cat /proc/$(pgrep -f "node index")/environ | tr '\0' '\n'`)

---

## File Map

**Create:**
- `Dockerfile` — multi-stage build (replaces the deprecated one)
- `.dockerignore` — updated to exclude yarn cache and mobile dirs
- `k8s/namespace.yaml`
- `k8s/secrets.yaml` — gitignored, contains runtime secrets
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/prometheus-rbac.yaml`
- `alertmanager/alertmanager.yml.tmpl` — template version of the alertmanager config

**Modify:**
- `.gitignore` — add `k8s/secrets.yaml`, `alertmanager/alertmanager.yml`
- `prometheus/prometheus.yml` — replace static `nodejs_app` job with `kubernetes_sd_configs`
- `alertmanager/alertmanager.yml` — fix inhibit rule, remove plaintext key (replaced by template)

**On VM1 filesystem (not in repo):**
- `/etc/nginx/sites-available/<site>` — update upstream block
- `/etc/prometheus/kubeconfig` — new file, generated from SA token
- `/etc/alertmanager/secrets` — new file, holds PAGERDUTY_SERVICE_KEY (mode 600)
- `/etc/alertmanager/start.sh` — new startup wrapper using envsubst

---

## Task 1: Rotate PagerDuty Key and Prepare Alertmanager Template

This is independent and should be done first — the key is already exposed in git history.

**Files:**
- Create: `alertmanager/alertmanager.yml.tmpl`
- Modify: `alertmanager/alertmanager.yml`
- Modify: `.gitignore`

- [ ] **Step 1: Rotate the PagerDuty integration key**

  Log in to PagerDuty → Services → your service → Integrations tab → find the "Prometheus" or relevant integration → Regenerate Key. Copy the new key. Do not commit it anywhere.

- [ ] **Step 2: Create the alertmanager template file**

  Create `alertmanager/alertmanager.yml.tmpl` with this exact content (the live file will be generated from it at runtime):

  ```yaml
  route:
    group_by: ['alertname']
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 1h
    receiver: pagerduty-receiver
    routes:
      - match:
          severity: critical
  receivers:
    - name: pagerduty-receiver
      pagerduty_configs:
      - service_key: ${PAGERDUTY_SERVICE_KEY}
  inhibit_rules:
    - source_matchers: [severity="critical"]
      target_matchers: [severity="warning"]
      equal: [alertname]
  ```

  Note the two changes from the current file:
  - `service_key` is now `${PAGERDUTY_SERVICE_KEY}` (env var placeholder)
  - `equal` is now `[alertname]` only (removing `dev` and `instance` which were never emitted by any alert rule, so inhibition was silently broken)

- [ ] **Step 3: Add gitignore entries**

  Add to `.gitignore`:
  ```
  k8s/secrets.yaml
  alertmanager/alertmanager.yml
  /etc/alertmanager/secrets
  ```

- [ ] **Step 4: On VM1 — store the new key and create the startup wrapper**

  SSH to VM1:
  ```bash
  sudo mkdir -p /etc/alertmanager
  sudo touch /etc/alertmanager/secrets
  sudo chmod 600 /etc/alertmanager/secrets
  sudo chown alertmanager:alertmanager /etc/alertmanager/secrets 2>/dev/null || sudo chown root:root /etc/alertmanager/secrets
  echo 'PAGERDUTY_SERVICE_KEY=<your-new-rotated-key>' | sudo tee /etc/alertmanager/secrets
  ```

  Create `/etc/alertmanager/start.sh`:
  ```bash
  sudo tee /etc/alertmanager/start.sh << 'EOF'
  #!/bin/bash
  set -e
  source /etc/alertmanager/secrets
  export PAGERDUTY_SERVICE_KEY
  envsubst '${PAGERDUTY_SERVICE_KEY}' \
    < /etc/alertmanager/alertmanager.yml.tmpl \
    > /etc/alertmanager/alertmanager.yml
  exec alertmanager --config.file=/etc/alertmanager/alertmanager.yml "$@"
  EOF
  sudo chmod +x /etc/alertmanager/start.sh
  ```

- [ ] **Step 5: Deploy the template to VM1 and regenerate the live config**

  From repo root:
  ```bash
  scp alertmanager/alertmanager.yml.tmpl <vm1-user>@<VM1_IP>:/etc/alertmanager/alertmanager.yml.tmpl
  ```

  On VM1, test generation:
  ```bash
  sudo /etc/alertmanager/start.sh --version
  # Expected: alertmanager version output (the exec replaces the shell so config is generated first)
  ```

  Then restart alertmanager using whichever init system is in use:
  ```bash
  # systemd:
  sudo systemctl restart alertmanager
  # or if running manually, update the ExecStart to use /etc/alertmanager/start.sh
  ```

- [ ] **Step 6: Verify alertmanager is healthy**

  ```bash
  curl -s http://localhost:9093/-/healthy
  # Expected: OK
  curl -s http://localhost:9093/api/v2/status | python3 -m json.tool | grep -A2 "configYAML\|uptime"
  # Expected: config loaded, uptime incrementing
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add alertmanager/alertmanager.yml.tmpl .gitignore
  git rm --cached alertmanager/alertmanager.yml 2>/dev/null || true
  git commit -m "fix(alertmanager): template pagerduty key via envsubst, fix inhibit equal matcher"
  ```

---

## Task 2: Install k3s Control Plane on VM1

**Files:** none in repo — VM1 system only.

- [ ] **Step 1: SSH to VM1 and install k3s server**

  ```bash
  curl -sfL https://get.k3s.io | sh -s - server \
    --node-name vm1 \
    --write-kubeconfig-mode 644
  ```

  Expected output ends with: `[INFO]  systemd: Starting k3s`

- [ ] **Step 2: Verify the control plane is ready**

  ```bash
  sudo kubectl get nodes
  # Expected:
  # NAME   STATUS   ROLES                  AGE   VERSION
  # vm1    Ready    control-plane,master   ...   v1.x.x+k3s1
  ```

  Wait up to 60 seconds for STATUS to become `Ready`.

- [ ] **Step 3: Retrieve the node join token**

  ```bash
  sudo cat /var/lib/rancher/k3s/server/node-token
  ```

  Copy this token — needed in Task 3. Store it securely (it grants worker join access to the cluster).

- [ ] **Step 4: Confirm VM1's cluster IP is reachable from VM2**

  Still on VM1:
  ```bash
  ip addr show | grep "inet " | grep -v 127
  # Note the IP in the shared subnet (e.g. 172.23.x.x or 10.x.x.x)
  # This is <VM1_CLUSTER_IP> used in the next task
  ```

---

## Task 3: Join VM2 as Worker Node

**Files:** none in repo — VM2 system only.

- [ ] **Step 1: SSH to VM2 and install k3s agent**

  Replace `<VM1_CLUSTER_IP>` with the IP noted in Task 2 Step 4, and `<NODE_TOKEN>` with the token from Task 2 Step 3:

  ```bash
  curl -sfL https://get.k3s.io | \
    K3S_URL=https://<VM1_CLUSTER_IP>:6443 \
    K3S_TOKEN=<NODE_TOKEN> \
    sh -s - agent --node-name vm2
  ```

- [ ] **Step 2: Verify both nodes are Ready (run on VM1)**

  ```bash
  sudo kubectl get nodes -o wide
  # Expected:
  # NAME   STATUS   ROLES                  AGE   VERSION        INTERNAL-IP
  # vm1    Ready    control-plane,master   ...   v1.x.x+k3s1   <VM1_IP>
  # vm2    Ready    <none>                 ...   v1.x.x+k3s1   172.23.205.204
  ```

  Both nodes must show `Ready` before proceeding.

---

## Task 4: Write Dockerfile and .dockerignore

**Files:**
- Create/overwrite: `Dockerfile`
- Modify: `.dockerignore`

- [ ] **Step 1: Write the dev Dockerfile**

  This image mirrors the local dev workflow exactly: yarn 1.22.19 installs dependencies, `npm run dev` runs TypeScript directly via `ts-node-dev --transpile-only` — no compilation, no build step.

  `package.json` declares `packageManager: yarn@3.6.0` which causes corepack (active in Node 18+) to intercept `yarn` calls and enforce Yarn Berry. Corepack must be disabled before installing yarn 1.22.19, otherwise the install will use the wrong yarn version.

  ```dockerfile
  FROM node:24.0.0

  WORKDIR /usr/src/app

  # Disable corepack so it does not intercept yarn with the packageManager field,
  # then pin yarn to 1.22.19 to match the local dev setup.
  RUN corepack disable && npm install -g yarn@1.22.19

  # Install dependencies before copying source for better layer caching.
  COPY package.json yarn.lock ./
  RUN yarn install

  COPY . .

  # PORT must be set to 3002 to match the Prometheus NodePort scrape config.
  # NODE_ENV=development is set by npm run dev via cross-env — no need to set it here.
  ENV PORT=3002

  EXPOSE 3002

  CMD ["npm", "run", "dev"]
  ```

- [ ] **Step 2: Write the updated .dockerignore**

  ```
  node_modules
  .yarn/cache
  dist
  *.log*
  .git
  android
  ios
  fastlane
  docs
  week_02.md
  *.tar.gz
  ```

- [ ] **Step 3: Build the image**

  ```bash
  docker build -t bestande:latest .
  ```

  Expected: build completes with no errors. The `yarn install` step will take a few minutes on first run. Final image will be large (all devDependencies included) — expected for a dev image.

  If `yarn install` fails with a corepack/version error, verify the `corepack disable` line ran correctly by checking the build log for the `RUN corepack disable` step output.

- [ ] **Step 4: Smoke-test the image**

  Run with the real `MONGODB_URI` from the live environment. The dev server connects to MongoDB on startup and will crash immediately if the URI is wrong.

  ```bash
  docker run --rm \
    -e MONGODB_URI="<your-staging-mongodb-uri>" \
    -e JWT_SECRET_KEY="<your-jwt-secret>" \
    -e ALGOLIA_PRIVATE_KEY="<your-algolia-key>" \
    -p 3002:3002 \
    bestande:latest
  ```

  Watch the logs. Expected sequence:
  1. `ts-node-dev` compilation output (a few seconds)
  2. MongoDB connection confirmation
  3. `App started.` or similar — server listening

  Then in another terminal:
  ```bash
  curl http://localhost:3002/health
  # Expected: HTTP 200
  curl http://localhost:3002/metrics | head -3
  # Expected: Prometheus text format (# HELP lines)
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add Dockerfile .dockerignore
  git commit -m "build: single-stage dev Dockerfile using node 24 and yarn 1.22.19"
  ```

---

## Task 5: Import Image into k3s on Both Nodes

**Files:** none in repo.

- [ ] **Step 1: Export the Docker image to a tar archive**

  On the machine where you built the image (Task 4):
  ```bash
  docker save bestande:latest | gzip > /tmp/bestande.tar.gz
  ls -lh /tmp/bestande.tar.gz
  # Expect: file present, size reasonable (hundreds of MB)
  ```

- [ ] **Step 2: Copy the archive to both VMs**

  ```bash
  scp /tmp/bestande.tar.gz <vm1-user>@<VM1_IP>:/tmp/bestande.tar.gz
  scp /tmp/bestande.tar.gz <vm2-user>@172.23.205.204:/tmp/bestande.tar.gz
  ```

- [ ] **Step 3: Import into k3s containerd on VM1**

  SSH to VM1:
  ```bash
  sudo k3s ctr images import /tmp/bestande.tar.gz
  sudo k3s ctr images ls | grep bestande
  # Expected: docker.io/library/bestande:latest   ... (size shown)
  ```

- [ ] **Step 4: Import into k3s containerd on VM2**

  SSH to VM2:
  ```bash
  sudo k3s ctr images import /tmp/bestande.tar.gz
  sudo k3s ctr images ls | grep bestande
  # Expected: docker.io/library/bestande:latest   ... (size shown)
  ```

---

## Task 6: Create Kubernetes Manifests

**Files:**
- Create: `k8s/namespace.yaml`
- Create: `k8s/secrets.yaml` (gitignored)
- Create: `k8s/deployment.yaml`
- Create: `k8s/service.yaml`

- [ ] **Step 1: Create the namespace manifest**

  `k8s/namespace.yaml`:
  ```yaml
  apiVersion: v1
  kind: Namespace
  metadata:
    name: bestande
  ```

- [ ] **Step 2: Retrieve current secret values from the running app**

  On VM1 (or VM2), read the live process environment to get the three secret values:
  ```bash
  sudo cat /proc/$(pgrep -f "node index" | head -1)/environ | tr '\0' '\n' | \
    grep -E "MONGODB_URI|JWT_SECRET_KEY|ALGOLIA"
  ```

  You need: `MONGODB_URI`, `JWT_SECRET_KEY`, `ALGOLIA_PRIVATE_KEY`.

- [ ] **Step 3: Create the secrets manifest**

  `k8s/secrets.yaml` — substitute real values for all `<...>` placeholders:
  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: bestande-secrets
    namespace: bestande
  type: Opaque
  stringData:
    mongodb-uri: "<MONGODB_URI>"
    jwt-secret-key: "<JWT_SECRET_KEY>"
    algolia-private-key: "<ALGOLIA_PRIVATE_KEY>"
  ```

  Verify `.gitignore` contains `k8s/secrets.yaml` (added in Task 1 Step 3) before saving this file.

- [ ] **Step 4: Create the Deployment manifest**

  `k8s/deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: bestande-web
    namespace: bestande
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: bestande-web
    template:
      metadata:
        labels:
          app: bestande-web
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/port: "3002"
          prometheus.io/path: "/metrics"
      spec:
        affinity:
          podAntiAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchLabels:
                  app: bestande-web
              topologyKey: kubernetes.io/hostname
        containers:
        - name: bestande-web
          image: docker.io/library/bestande:latest
          imagePullPolicy: Never
          ports:
          - containerPort: 3002
            name: http
          env:
          - name: PORT
            value: "3002"
          # NODE_ENV=development is set by npm run dev via cross-env — not set here.
          - name: MONGODB_URI
            valueFrom:
              secretKeyRef:
                name: bestande-secrets
                key: mongodb-uri
          - name: JWT_SECRET_KEY
            valueFrom:
              secretKeyRef:
                name: bestande-secrets
                key: jwt-secret-key
          - name: ALGOLIA_PRIVATE_KEY
            valueFrom:
              secretKeyRef:
                name: bestande-secrets
                key: algolia-private-key
          livenessProbe:
            httpGet:
              path: /health
              port: 3002
            # ts-node-dev transpiles on first run — allow extra time before probing.
            initialDelaySeconds: 120
            periodSeconds: 15
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: 3002
            initialDelaySeconds: 60
            periodSeconds: 10
            failureThreshold: 3
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "1Gi"
              cpu: "500m"
  ```

- [ ] **Step 5: Create the NodePort Service manifest**

  `k8s/service.yaml`:
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: bestande-web
    namespace: bestande
  spec:
    type: NodePort
    externalTrafficPolicy: Local
    selector:
      app: bestande-web
    ports:
    - name: http
      port: 3002
      targetPort: 3002
      nodePort: 30002
  ```

- [ ] **Step 6: Commit (secrets.yaml excluded)**

  ```bash
  git add k8s/namespace.yaml k8s/deployment.yaml k8s/service.yaml
  git commit -m "feat(k8s): add namespace, deployment, and NodePort service manifests"
  ```

---

## Task 7: Deploy App to k3s and Verify

**Files:** none new — applies manifests from Task 6 to the cluster on VM1.

- [ ] **Step 1: Apply the namespace and secrets**

  On VM1:
  ```bash
  sudo kubectl apply -f k8s/namespace.yaml
  sudo kubectl apply -f k8s/secrets.yaml
  sudo kubectl get secret bestande-secrets -n bestande
  # Expected: bestande-secrets   Opaque   6   ...
  ```

- [ ] **Step 2: Apply the Deployment and Service**

  ```bash
  sudo kubectl apply -f k8s/deployment.yaml
  sudo kubectl apply -f k8s/service.yaml
  ```

- [ ] **Step 3: Watch pods come up**

  ```bash
  sudo kubectl get pods -n bestande -o wide -w
  ```

  Wait until both pods show `Running` and `1/1` Ready. This may take 2–3 minutes (sync.js runs MongoDB index creation before the server starts, which delays readiness).

  Expected output:
  ```
  NAME                            READY   STATUS    NODE
  bestande-web-<hash>-<id1>       1/1     Running   vm1
  bestande-web-<hash>-<id2>       1/1     Running   vm2
  ```

  If a pod stays in `Pending`: `sudo kubectl describe pod <pod-name> -n bestande` — likely anti-affinity cannot be satisfied (only fires if 2 nodes are not Ready; verify Task 3).
  If a pod enters `CrashLoopBackOff`: `sudo kubectl logs <pod-name> -n bestande` — check for missing env vars or MongoDB connection errors.

- [ ] **Step 4: Verify NodePort responds on both nodes**

  On VM1:
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:30002/health
  # Expected: 200
  ```

  On VM2:
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:30002/health
  # Expected: 200
  ```

- [ ] **Step 5: Verify metrics endpoint**

  On VM1:
  ```bash
  curl -s http://localhost:30002/metrics | head -5
  # Expected: Prometheus text format output (# HELP ... lines)
  ```

---

## Task 8: Update Nginx Upstream on VM1

**Files:** `/etc/nginx/sites-available/<site>` on VM1 (not in repo).

- [ ] **Step 1: Find the nginx site config file**

  On VM1:
  ```bash
  sudo nginx -T 2>/dev/null | grep "# configuration file" | grep -v "nginx.conf"
  # Expected: path like /etc/nginx/sites-available/bestande or /etc/nginx/conf.d/bestande.conf
  ```

- [ ] **Step 2: Backup the current config**

  ```bash
  sudo cp /etc/nginx/sites-available/<site> /etc/nginx/sites-available/<site>.bak.$(date +%Y%m%d)
  ```

- [ ] **Step 3: Update the upstream block**

  Find and replace the upstream block that currently references the app IPs. The existing block likely looks like:
  ```nginx
  upstream bestande_backend {
      server localhost:3002;
      server 172.23.205.204:3002;
  }
  ```

  Replace with:
  ```nginx
  upstream bestande_backend {
      server localhost:30002;
      server 172.23.205.204:30002;
  }
  ```

  Use your editor of choice: `sudo nano /etc/nginx/sites-available/<site>` or `sudo sed -i 's/:3002/:30002/g' /etc/nginx/sites-available/<site>`.

  > If the upstream block uses raw IPs differently or has additional directives (keepalive, weight, etc.), preserve them — only change the port from 3002 to 30002.

- [ ] **Step 4: Test nginx configuration**

  ```bash
  sudo nginx -t
  # Expected:
  # nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
  # nginx: configuration file /etc/nginx/nginx.conf test is successful
  ```

  If this fails, restore the backup: `sudo cp /etc/nginx/sites-available/<site>.bak.$(date +%Y%m%d) /etc/nginx/sites-available/<site>`

- [ ] **Step 5: Reload nginx**

  ```bash
  sudo nginx -s reload
  ```

- [ ] **Step 6: Verify end-to-end through nginx**

  ```bash
  curl -sk https://staging.bestande.ch/health
  # Expected: HTTP 200 response
  curl -sk https://172.23.205.204/health
  # Expected: HTTP 200 response
  ```

  > The `-k` flag skips certificate verification for the direct IP probe. The staging domain probe should be fully valid.

---

## Task 9: Prometheus RBAC and Kubeconfig for Dynamic Discovery

**Files:**
- Create: `k8s/prometheus-rbac.yaml`

- [ ] **Step 1: Create the Prometheus RBAC manifest**

  `k8s/prometheus-rbac.yaml`:
  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: prometheus
    namespace: bestande
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    name: prometheus
  rules:
  - apiGroups: [""]
    resources: ["nodes", "pods", "endpoints", "services"]
    verbs: ["get", "list", "watch"]
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRoleBinding
  metadata:
    name: prometheus
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: prometheus
  subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: bestande
  ---
  apiVersion: v1
  kind: Secret
  metadata:
    name: prometheus-token
    namespace: bestande
    annotations:
      kubernetes.io/service-account.name: prometheus
  type: kubernetes.io/service-account-token
  ```

- [ ] **Step 2: Apply the RBAC resources**

  On VM1:
  ```bash
  sudo kubectl apply -f k8s/prometheus-rbac.yaml
  sudo kubectl get serviceaccount prometheus -n bestande
  # Expected: prometheus   1   ...
  sudo kubectl get secret prometheus-token -n bestande
  # Expected: prometheus-token   kubernetes.io/service-account-token   ...
  ```

- [ ] **Step 3: Extract the SA token and CA cert**

  ```bash
  TOKEN=$(sudo kubectl get secret prometheus-token -n bestande \
    -o jsonpath='{.data.token}' | base64 --decode)
  CA_CERT=$(sudo kubectl get secret prometheus-token -n bestande \
    -o jsonpath='{.data.ca\.crt}')
  VM1_IP=$(ip addr show | grep "inet " | grep -v 127 | awk '{print $2}' | cut -d/ -f1 | head -1)
  echo "Token length: ${#TOKEN}"   # Should be > 100 chars
  echo "CA cert length: ${#CA_CERT}"  # Should be > 100 chars
  echo "VM1 IP: $VM1_IP"
  ```

- [ ] **Step 4: Write the kubeconfig file**

  ```bash
  sudo mkdir -p /etc/prometheus
  sudo tee /etc/prometheus/kubeconfig << EOF
  apiVersion: v1
  kind: Config
  clusters:
  - cluster:
      server: https://${VM1_IP}:6443
      certificate-authority-data: ${CA_CERT}
    name: k3s
  contexts:
  - context:
      cluster: k3s
      user: prometheus
    name: prometheus@k3s
  current-context: prometheus@k3s
  users:
  - name: prometheus
    user:
      token: ${TOKEN}
  EOF
  sudo chmod 600 /etc/prometheus/kubeconfig
  sudo chown prometheus:prometheus /etc/prometheus/kubeconfig 2>/dev/null || true
  ```

- [ ] **Step 5: Verify the kubeconfig can reach the API**

  ```bash
  sudo kubectl --kubeconfig=/etc/prometheus/kubeconfig get pods -n bestande
  # Expected: lists the two bestande-web pods
  sudo kubectl --kubeconfig=/etc/prometheus/kubeconfig get pods --all-namespaces
  # Expected: lists pods across all namespaces (read-only access confirmed)
  ```

- [ ] **Step 6: Commit the RBAC manifest**

  ```bash
  git add k8s/prometheus-rbac.yaml
  git commit -m "feat(k8s): add prometheus RBAC for kubernetes_sd_configs discovery"
  ```

---

## Task 10: Migrate Prometheus to kubernetes_sd_configs

**Files:**
- Modify: `prometheus/prometheus.yml`

- [ ] **Step 1: Replace the `nodejs_app` static job**

  In `prometheus/prometheus.yml`, find this block:
  ```yaml
    - job_name: nodejs_app
      metrics_path: /metrics
      scheme: http
        #tls_config:
        #insecure_skip_verify: true
      static_configs:
        - targets: ['localhost:3002','172.23.205.204:3002']
  ```

  Replace it entirely with:
  ```yaml
    - job_name: nodejs_app
      metrics_path: /metrics
      scheme: http
      kubernetes_sd_configs:
      - role: pod
        kubeconfig_file: /etc/prometheus/kubeconfig
        namespaces:
          names:
          - bestande
      relabel_configs:
      # Keep only pods annotated for scraping
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"
      # Override metrics path from annotation if present
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      # Rewrite address to pod_ip:annotation_port
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      # Add informational labels for dashboards
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_node_name]
        target_label: node
  ```

- [ ] **Step 2: Deploy the updated config to VM1 and reload Prometheus**

  ```bash
  scp prometheus/prometheus.yml <vm1-user>@<VM1_IP>:/etc/prometheus/prometheus.yml
  ```

  On VM1, validate the config before reloading:
  ```bash
  promtool check config /etc/prometheus/prometheus.yml
  # Expected: SUCCESS: /etc/prometheus/prometheus.yml is valid
  ```

  Then reload:
  ```bash
  sudo systemctl reload prometheus
  # or, if Prometheus supports hot reload:
  curl -X POST http://localhost:9090/-/reload
  ```

- [ ] **Step 3: Verify dynamic targets appear in Prometheus**

  Wait 20–30 seconds for the first scrape cycle, then:
  ```bash
  curl -s http://localhost:9090/api/v1/targets | \
    python3 -m json.tool | \
    python3 -c "import sys,json; d=json.load(sys.stdin); [print(t['labels']['job'], t['labels'].get('pod',''), t['health']) for t in d['data']['activeTargets'] if t['labels']['job']=='nodejs_app']"
  # Expected: two lines like:
  # nodejs_app   bestande-web-<hash>-<id1>   up
  # nodejs_app   bestande-web-<hash>-<id2>   up
  ```

  If targets are `down` with a connection error, verify the pod IPs are reachable from VM1: `curl http://<pod-ip>:3002/metrics`.
  If targets don't appear at all (empty list), verify the kubeconfig has correct permissions (Task 9 Step 5) and the pod annotations are set: `sudo kubectl get pods -n bestande -o yaml | grep prometheus.io`.

- [ ] **Step 4: Verify existing alert rules still evaluate**

  ```bash
  curl -s http://localhost:9090/api/v1/rules | \
    python3 -m json.tool | \
    python3 -c "import sys,json; d=json.load(sys.stdin); [print(r['name'], r['health']) for g in d['data']['groups'] for r in g['rules']]"
  # Expected: all rules listed with health: "ok" (no "err" entries)
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add prometheus/prometheus.yml
  git commit -m "feat(prometheus): migrate nodejs_app job to kubernetes_sd_configs dynamic discovery"
  ```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task(s) |
|---|---|
| k3s control plane on VM1 | Task 2 |
| k3s worker on VM2 | Task 3 |
| Single-stage dev Dockerfile (node 24, yarn 1.22.19, ts-node-dev) | Task 4 |
| Image import to k3s containerd | Task 5 |
| Namespace, Deployment, NodePort Service | Task 6 |
| Pod anti-affinity (one pod per node) | Task 6 Step 4 |
| `externalTrafficPolicy: Local` | Task 6 Step 5 |
| Deploy and verify pods | Task 7 |
| Nginx upstream update to NodePort | Task 8 |
| Prometheus ServiceAccount + RBAC | Task 9 |
| `kubernetes_sd_configs` job config | Task 10 |
| Relabeling rules (pod, namespace, node labels) | Task 10 Step 1 |
| Verify targets up and rules healthy | Task 10 Steps 3–4 |
| Alertmanager inhibit fix | Task 1 Step 2 |
| PagerDuty key rotation + envsubst | Task 1 Steps 1, 4–6 |

All spec requirements are covered. No gaps found.

**Placeholder scan:** No TBD, TODO, or "similar to" references. All code blocks are complete. The only required substitutions are explicit `<PLACEHOLDER>` values that must come from the running environment (VM IPs, actual secret values) and cannot be predicted.

**Type consistency:** No shared types across tasks — this is infrastructure/config work. YAML keys and file paths are consistent across all tasks.
