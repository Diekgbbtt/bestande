import client from 'prom-client';

// in-memory metrics store with a data formar comptabile woth prometheus
const register = new client.Registry();

// collection of default metrics (e.g. CPU and memory usage)
// not needed for now - we'll be using blackbox exporter
client.collectDefaultMetrics({ register });

const httpRequestsCounter = new client.Counter({
    name: "http_request_total",
    help: "Total number of HTTP requests indexable for response code and route",
    labelNames: ["route", "status_code"],
    registers: [register],
})

const httpRequestLatency = new client.Histogram({
    name: "http_requests_latency",
    help: "Time in s taken to process a request end-to-end from the application, indexable for route and status_code",
    labelNames: ["route", "status_code"],
    buckets: [0.0001, 0.0025, 0.005, 0.0075, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 1],
    registers: [register],
})

const metricsMiddleware = (request: import('express').Request, response: import('express').Response, next: import('express').NextFunction) => {

    // prevent spurious metrics collection
    if (request.path === '/metrics' || request.path === '/health') {
        return next();
    }
    
    const end = httpRequestLatency.startTimer();
    response.on('finish', () => {
        const labels = {
            route: request.path,
            status_code: String(response.statusCode)
        }
        httpRequestsCounter.inc(labels);
        end(labels);
    });
    next();
}

const metricsScraperHandler = async (request: import('express').Request, response: import('express').Response) => {
    response.set('Content-Type', register.contentType);
    response.end(await register.metrics());
}

export {metricsScraperHandler, metricsMiddleware};


