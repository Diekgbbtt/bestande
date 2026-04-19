# Phase 3 - AlertManager+PagerDuty Alerting

[Week 05 - Assignment.pdf](Phase%203%20-%20AlertManager+PagerDuty%20Alerting/Week_05_-_Assignment.pdf)

Guidelines : 

- Have a SLO safety margin : set internal SLOs slightly higher than agreed ones in SLAs
- Multi-time window, multi-burn rate alerting strategy
- Precise in SLO definition and oriented to critical steps in user stories :
    - We narrow down the scope to only endpoints involved in critical user stories
    - Context : SPA frontend, monolith nodejs backend that leverages Algolia for in-memory courses data storage(search-as-a-service hosted platform). Algolia is a cloud search-optimization service used to pre-load and continuously sync in-memory from DB the courses+metadata catalog and search fast indexed data, when searching for courses the frontend calls directly Algolia
    hence critical endpoints are considered:
        - the root and all others under it(beside /voting which does not work), through which the frontend can be accessed;
        - API domains currently consumed by the frontend
            - /api/institution/uzh/module/<module-id>(for not logged-in users) to get a course data over its past semesters for 2022
            - /api/courses/<courseid>/[documents, ratings, statistics]
            - /api/courses/<courseid>/ratings/personal - personal ratings
            - /api/courses - courses+metadata catalog (/uzh/search) from Algoli
        
    
    | Metric | What is good | SLO in SLA | SLO Internal | SLI | Monitoring and Measurement SLI Logic  | Metric Query |
    | --- | --- | --- | --- | --- | --- | --- |
    | Availability | max 0,5% of requests to mentioned endpoints returns 500 | 99,0% | 99,5% | non-500 responses to endpoints that deliver necessary functional frontend code | explained above |  |
    | HTTP Latency under standard load | standard load : 0,5 rps
    95th < 500 ms | 95th percentile(30 days) under 800 ms | 95th percentile(30 days) under 500 ms | sum of all requests durations to get all necessary FE code artifacts  | explained above |  |
    | HTTP Errors Count | some errors on endpoints where non-necessary artifacts are exposed are accepted | 97% | 99% | non-500 responses to endpoints that deliver any frontend code artifacts | Lower than availability bcs we may have more endpoints to consider
    Not considering the ones currently returning 500 already. |  |
    | TLS availability risk | keep the expiry higher than 20 days | expiry > 20 | expiry > 15 | days(certificate expiry date - now)  | just for completeness : always offer TLS connections - never make the certificate expire |  |
    | SLO of choice : HTTP Latency of backend API under high load - proxy to Throughput capacity | high load to BE : 100 < rps < 200
    the requests that are taking the most should  be under 300 ms | 95th percentile under 400 ms | 95th percentile under 300 ms |  | requests that can be handled per second among all API endpoints considering an high load - after 500 |  |

note : maybe instead of throughput we could define an SLO for for critical user stories steps success rate, e.g. time taken to download domcuments with MBps

- Availability is measured wrt the endpoints bringing frontend code artifacts necessary for it to execute - if .png or other corollary artifact returns 500 we do not care
- HTTP Errors Count is measured wrt all the endpoints called to get the frontend code artifacts
- HTTP Latency under standard load is measured wrt get the page(frontend code) - how long it takes to get all the frontend code artifacts : only 200 to any endpoint
- TLS is self-explanatory
- HTTP Latency of backend API under high load - proxy to throughput capacity - measured wrt to backend API endpoints excluding Algolia and for documents retrieval and grounding our SLO on 700 average visitors per day during course selection period
    - Rationale on choosing this SLO : a critical step of user stories is reading relevant data of courses they are interested in and, we expect an higher load during courses selection periods. Additionally, technical reasons we found our decision on : although the webapp is monolith, the SPA fetches a course data(main info, rating, grades statistics) from the backend, which exposes an API; in a modular enhancement of the application this backend components are separate from the frontend and can be deployed, scaled, and fail independently.

- Frontend artifacts relevant to critical functionality(Availability and Latency) :
    - / , /uzh/search , [/votin](https://localhost:3001/voting)g, /login and any url path delivering the FE code
    - /static/app.js (main JavaScript bundle, contains all FE logic)
    - /static/main.css (main stylesheet, required for layout and usability)
    - /static/manifest.json (required for PWA installability and some browser features)

All FE artifacts

- / , /uzh/search , [/votin](https://localhost:3001/voting)g, /login or any url path delivering index.html
- /static/*
    - /static/app.js
    - /static/bestande-type-small.png
    - /static/blacklogo.png
    - /static/icu_logo_full.png
    - /static/IOS_Download1.png
    - /static/IOS_Download2.png
    - /static/logo-white.png
    - /static/logo.png
    - /static/main.css
    - /static/icons-pwa/manifest-icon-192.maskable.png
    - /static/manifest.json
    - /static/vsuzh_logo.png

- Backend API endpoints excluding Algolia and single /documents download for each course :
    - /api/institution/uzh/module/<moduleid>
    - /api/institution/uzh/module/<moduleid>/documents
    - /api/institution/uzh/module/<moduleid>/ratings

SLOs are expressed always with a time range of 30 days, starting from 27/03 12 am

**Alerting Strategy : Multi-time window multi-burn rate**

- Time windows : we adopt one short and one long time windows per alert class(warning critical), which change slightly according to the measured metric.
- Burn rates : two distinct rates increasing with the alert severity, which likewise change slightly according to the measured metric.

We’ll be triggering a critical alert only if both windows burn rates thresholds are exceeded, whereas a warning if either of the two exceeds. Whereas for normal warnings if both windows burn rates thresholds are exceeded.

| SLO  | Alert Severity | Windows(short/long) | Burn Rate | Error Budget | Alert Threshold (Error Ratio) | PromQL Template | Alert Rule  PromQL expression  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Availability (FE critical endpoints) | Critical | 5m / 1h | 14.4 | 0.005 | 0.072 (7.2%) | (error_ratio_5m > 0.072) AND (error_ratio_1h > 0.072) | (
sum(rate(http_request_total{status=~"5..", path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[5m]))
/
sum(rate(http_request_total{path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[5m])) > 0.072
)
AND
(
sum(rate(http_request_total{status=~"5..", path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[1h]))
/
sum(rate(http_request_total{path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[1h])) > 0.072
) |
| Availability (FE critical endpoints) | Warning | 2h / 1d | 3 | 0.005 | 0.015 (1.5%) | (error_ratio_2h > 0.015) AND (error_ratio_1d > 0.015) | (sum(rate(http_request_total{status=~"5..", path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[2h])) / sum(rate(http_request_total{path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[2h])) > 0.015)
AND
(sum(rate(http_request_total{status=~"5..", path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[1d])) / sum(rate(http_request_total{path=~"/|/uzh/search|/voting|/login|/static/app.js|/static/main.css|/static/manifest.json"}[1d])) > 0.015)
labels:
severity: warning |
| HTTP Latency (standard load, >500ms = bad) | Critical | 5m / 1h | 10 | 0.05 | 0.5 (50%) | (slow_ratio_5m > 0.5) AND (slow_ratio_1h > 0.5) | (
sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[5m]))
- sum(rate(http_request_latency_bucket{le="0.5",path=~"/|/uzh/search|/voting|/login|/static/.*"}[5m]))
) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[5m])) > 0.5
AND
(
sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[1h]))
- sum(rate(http_request_latency_bucket{le="0.5",path=~"/|/uzh/search|/voting|/login|/static/.*"}[1h]))
) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[1h])) > 0.5
** |
| HTTP Latency (standard load, >500ms = bad) | Warning | 2h / 1d | 2 | 0.05 | 0.1 (10%) | (slow_ratio_2h > 0.1) AND (slow_ratio_1d > 0.1) | (
sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[2h]))
- sum(rate(http_request_latency_bucket{le="0.5",path=~"/|/uzh/search|/voting|/login|/static/.*"}[2h]))
) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[2h])) > 0.1
AND
(
sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[1d]))
- sum(rate(http_request_latency_bucket{le="0.5",path=~"/|/uzh/search|/voting|/login|/static/.*"}[1d]))
) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[1d])) > 0.1 |
| HTTP Errors Count (all FE endpoints) | Critical | 5m / 1h | 10 | 0.01 | 0.1 (10%) | (error_ratio_5m > 0.1) AND (error_ratio_1h > 0.1) | (sum(rate(http_request_latency_count{status=~"5..",path=~"/|/uzh/search|/voting|/login|/static/.*"}[5m])) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[5m])) > 0.1)
AND
(sum(rate(http_request_latency_count{status=~"5..",path=~"/|/uzh/search|/voting|/login|/static/.*"}[1h])) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[1h])) > 0.1) |
| HTTP Errors Count (all FE endpoints) | Warning | 6h / 3d | 2 | 0.01 | 0.02 (2%) | (error_ratio_6h > 0.02) AND (error_ratio_3d > 0.02) | (sum(rate(http_request_latency_count{status=~"5..",path=~"/|/uzh/search|/voting|/login|/static/.*"}[6h])) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[6h])) > 0.02)
AND
(sum(rate(http_request_latency_count{status=~"5..",path=~"/|/uzh/search|/voting|/login|/static/.*"}[3d])) / sum(rate(http_request_latency_count{path=~"/|/uzh/search|/voting|/login|/static/.*"}[3d])) > 0.02) |
| Backend API Latency (high load, >300ms = bad) | Critical | 2m / 30m | 20 | 0.05 | 1.0 (100%) | (slow_ratio_2m > 1.0) AND (slow_ratio_30m > 1.0) | (
sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[2m]))
- sum(rate(http_request_latency_bucket{le="0.3",path=~"/api/institution/uzh/module/.*"}[2m]))
) / sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[2m])) >= 1.0
AND
(
sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[30m]))
- sum(rate(http_request_latency_bucket{le="0.3",path=~"/api/institution/uzh/module/.*"}[30m]))
) / sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[30m])) >= 1.0 |
| Backend API Latency (high load, >300ms = bad) | Warning | 1h / 12h | 4 | 0.05 | 0.2 (20%) | (slow_ratio_1h > 0.2) AND (slow_ratio_12h > 0.2) | (
sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[1h]))
- sum(rate(http_request_latency_bucket{le="0.3",path=~"/api/institution/uzh/module/.*"}[1h]))
) / sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[1h])) > 0.2
AND
(
sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[12h]))
- sum(rate(http_request_latency_bucket{le="0.3",path=~"/api/institution/uzh/module/.*"}[12h]))
) / sum(rate(http_request_latency_count{path=~"/api/institution/uzh/module/.*"}[12h])) > 0.2 |
| TLS Certificate Expiry | Critical | < 15 days | N/A | N/A | N/A | ssl_cert_expiry_days < 15 | (probe_ssl_earliest_cert_expiry - time()) / 86400 < 15 |
| TLS Certificate Expiry | Warning | < 30 days | N/A | N/A | N/A | ssl_cert_expiry_days < 30 | (probe_ssl_earliest_cert_expiry - time()) / 86400 < 30 |

**Additional notes on windows and burn rates design choices**

Our design is aimed to guarantee a sufficiently good level of precision, recall, low detection time and reset time, acknowledging that we can’t have ideally perfect values for all of these alerting dimensions and we must come to a tradeoff.
The alerting is grounded on a two folded strategy : 

- short time windows enable us to detect SLO threats promptly, but they are just warning noise if they are a brief spike, as the second window burn rate is not exceeded and a critical alert is not fired.
- long time windows enable us to detect SLO threats that are manifesting in a slower manner, gradually consuming the error budget, with low warning noise, however their detection and reset time is (intentionally) significantly high.

Finally, we recognize that there are still some blind spots that our strategy do not cover, although minimal.

**Outliers Rules for Availability**

| SLO | Alert Severity | Windows (short / long) | Burn Rate | Error Budget | Alert Threshold (Error Ratio) | PromQL Template | Alert Rule Expression |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Availability (FE critical endpoints) – Massive spike | Critical | 1m / N/A | N/A | 0.005 | 0.2 (20%) | error_ratio_1m > 0.2 | sum(rate(http_request_total{status=~"5..", path=~"/ |
| Availability (FE critical endpoints) – Budget half consumed mid-period | Warning | 15d / N/A | 1 | 0.01 | 0.005 (0.5%) | error_ratio_15d > 0.005 | sum(rate(http_request_total{status=~"5..", path=~"/ |
| Availability (FE critical endpoints) – Sustained slow burn | Warning | 6h / N/A | 1 | 0.01 | 0.01 (1%) | error_ratio_6h > 0.01 | sum(rate(http_request_total{status=~"5..", path=~"/ |

### Pagerduty and alertmanager setup

1. Installation of Alertmanager

Install alert-manager.
``` bash
mkdir alertmanager
wget https://github.com/prometheus/alertmanager/releases/download/v0.31.1/alertmanager-0.31.1.linux-amd64.tar.gz
tar -xzf alertmanager-0.31.1.linux-amd64.tar.gz
cd alertmanager-0.31.1.linux-amd64/
```
2. Wrapped Alertmanager in a system service

For pagerduty we followed the UI in order to setup the schedule which is basically Georgios and Diego each day interchangeably starting from Thursday 26/3/2026.
For the policy in order to setup a first responder and a second responder there needs to be two schedules, with the one being the inverse of the other and since
in the free version we can only have one schedule, we setup the first responder and the second responder is both of us.
When an alert fires, the first responder gets notified, either by a call or an email. At the moment only critical alerts are sent to pagerduty.