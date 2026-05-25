# k3s Containerization & Prometheus Dynamic Discovery — Design Spec

**Date:** 2026-05-25

---

## Goal

Containerize the Bestande Node.js application, deploy it on a self-managed k3s cluster across two existing VMs, and replace Prometheus's static scrape targets with dynamic pod-annotation-based discovery via `kubernetes_sd_configs`. All supporting infrastructure (nginx, Prometheus, Alertmanager, mtail, blackbox-exporter, node-exporter, MongoDB) remains bare-metal.

---

## Current Topology

```
Internet
   │ HTTPS
   ▼
[VM1: nginx-instance1]  ──bare-metal──  nginx (TLS terminator)
                                         Prometheus :9090
                                         Alertmanager :9093
                                         mtail :3903
                                         blackbox-exporter :9115
                                         node-exporter :9100
                                         app process :3002   ← to be containerized

[VM2: 172.23.205.204]   ──bare-metal──  MongoDB :27017
                                         mongodb-exporter :9216
                                         node-exporter :9100
                                         app process :3002   ← to be containerized

Prometheus scrapes VM2 by static IP.
nginx proxies to both VMs by static IP.
```

---

## Target Topology

```
Internet
   │ HTTPS
   ▼
[VM1: nginx-instance1]  ──bare-metal──  nginx → localhost:30002 (NodePort)
                                         Prometheus → k3s API → pod IPs (dynamic)
                                         Alertmanager, mtail, blackbox-exporter (unchanged)
                                         k3s control plane + worker node

[VM2: 172.23.205.204]   ──bare-metal──  MongoDB (unchanged)
                                         node-exporter, mongodb-exporter (unchanged)
                                         k3s worker node

k3s cluster (namespace: bestande):
  Deployment: bestande-web (2 replicas, one per node via anti-affinity)
  Service:    NodePort :30002, externalTrafficPolicy: Local
```

---

## Components

### 1. k3s Cluster

- **VM1**: control plane + worker node (`k3s server`)
- **VM2**: worker node only (`k3s agent`)
- Single-server topology — no HA control plane needed for this scale
- k3s uses its own containerd runtime; images are imported directly via `k3s ctr images import` (no external registry required)

### 2. Application Container

Multi-stage Dockerfile:

| Stage | Base | Purpose |
|---|---|---|
| `builder` | `node:20.6.1` | Install all deps, run `npm run build` (tsc + copy + webpack) |
| `runtime` | `node:20.6.1-slim` | Production deps only, compiled `dist/`, no source |

Build-time `ARG`s (baked into the webpack frontend bundle):
- `REACT_APP_ONESIGNAL_APP_ID`
- `REACT_APP_ONESIGNAL_SAFARI_WEB_ID`
- `REACT_APP_OIDC_CLIENT_ID`
- `REACT_APP_OIDC_REDIRECT_URI`

Runtime env vars (injected via k8s Secret / Deployment env):
- `NODE_ENV=production`
- `PORT=3002`
- `DOMAIN`, `MONGODB_URI`, `SECRET_KEY`, `JWT_SECRET_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `ALGOLIA_PRIVATE_KEY`

Start sequence (matches existing production behaviour): `node sync.js && node index.js` from `dist/web/src/`. `sync.js` runs MongoDB index initialization then exits; `index.js` starts the Express server.

### 3. Kubernetes Manifests (`k8s/`)

| File | Purpose |
|---|---|
| `namespace.yaml` | `bestande` namespace |
| `secrets.yaml` | k8s Secret for all runtime secrets (gitignored) |
| `deployment.yaml` | 2-replica Deployment with pod anti-affinity (one pod per node), Prometheus scrape annotations, liveness/readiness probes on `/health:3002` |
| `service.yaml` | NodePort Service, port 30002, `externalTrafficPolicy: Local` |
| `prometheus-rbac.yaml` | ServiceAccount + ClusterRole (read pods/endpoints) + ClusterRoleBinding for Prometheus |

`externalTrafficPolicy: Local` is non-negotiable: it ensures kube-proxy on each node only routes to locally-scheduled pods, preserving the traffic locality that nginx currently relies on and avoiding cross-node hops hidden from nginx's upstream health-checking.

Pod anti-affinity (`requiredDuringSchedulingIgnoredDuringExecution`, `topologyKey: kubernetes.io/hostname`) guarantees exactly one pod per node. This is a hard requirement: NodePort with `externalTrafficPolicy: Local` fails for a given node if no pod is scheduled there.

### 4. Prometheus Dynamic Discovery

Replace the static `nodejs_app` scrape job with `kubernetes_sd_configs`:

```yaml
kubernetes_sd_configs:
- role: pod
  kubeconfig_file: /etc/prometheus/kubeconfig
  namespaces:
    names: [bestande]
```

A dedicated ServiceAccount (`prometheus` in namespace `bestande`) with a ClusterRole granting read access to pods/endpoints provides the kubeconfig. The kubeconfig file is placed at `/etc/prometheus/kubeconfig` on VM1, owned by the Prometheus process user, mode 600.

Pod selection is driven by annotations on the Deployment pod template:
```
prometheus.io/scrape: "true"
prometheus.io/port:   "3002"
prometheus.io/path:   "/metrics"
```

Relabeling rules rewrite `__address__` to `pod_ip:annotation_port` and add `pod`, `namespace`, `node` labels for dashboards.

All other Prometheus jobs (`mongodb`, `node`, `nginx_mtail`, `blackbox_ssl`) remain static — their targets are bare-metal and their IPs do not change.

**Label impact on existing alerts:** All current SLO alert rules aggregate with `sum()` across all instances — they survive unchanged. The `inhibit_rules` `equal` matcher currently lists `[alertname, dev, instance]`; neither `dev` nor `instance` are emitted as labels by any alert rule, so inhibition has never fired. This is fixed in the same change (see §5).

### 5. Alertmanager Inhibit Fix

Change:
```yaml
equal: [alertname, dev, instance]
```
To:
```yaml
equal: [alertname]
```

This makes critical alerts correctly suppress their warning counterparts for the same alertname, which is the intended behaviour.

### 6. PagerDuty Key Remediation

The PagerDuty `service_key` is currently in plaintext in `alertmanager.yml` and committed to the repo. Steps:
1. Rotate the key in PagerDuty immediately (independent of migration).
2. Store the new key in `/etc/alertmanager/secrets` (mode 600, owned by alertmanager user).
3. Convert `alertmanager.yml` to a template (`alertmanager.yml.tmpl`) with `${PAGERDUTY_SERVICE_KEY}` substitution.
4. Add a startup wrapper script that sources the secrets file and runs `envsubst` to generate the live config before launching alertmanager.
5. Commit `alertmanager.yml.tmpl` (no secrets). The live `alertmanager.yml` is generated at runtime and gitignored.

### 7. Nginx Upstream Update

On VM1's nginx site config (`/etc/nginx/sites-available/<site>`), replace the current upstream block pointing to raw VM IPs with NodePort addresses:

```nginx
upstream bestande_backend {
    server localhost:30002;
    server 172.23.205.204:30002;
}
```

TLS configuration is unchanged. This is the only nginx change required.

---

## Out of Scope

- CI/CD pipeline changes
- Container registry setup
- Monitoring stack containerization (Prometheus, Alertmanager, mtail, blackbox-exporter)
- MongoDB containerization
- Nginx containerization
- Mobile/React Native builds
- HA control plane
