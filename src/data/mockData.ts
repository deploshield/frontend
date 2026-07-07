import { Project, Target, DeploymentHistoryItem, ContainerStatus, LogEntry, DNSRecord } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'acme-api-gateway',
    repository: 'acme-corp/api-gateway',
    framework: 'Next.js',
    runtime: 'Node.js',
    branch: 'main',
    lastDeployment: '3 mins ago',
    status: 'Success',
    dockerfile: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
    envVars: [
      { id: '1', key: 'DATABASE_URL', value: 'postgresql://admin:supersecret@db.deployshield.internal:5432/production', isSecret: true },
      { id: '2', key: 'PORT', value: '3000', isSecret: false },
      { id: '3', key: 'JWT_SECRET', value: 'sk_live_99a8x88b77c66d55e44f', isSecret: true },
      { id: '4', key: 'LOG_LEVEL', value: 'info', isSecret: false }
    ]
  },
  {
    id: 'proj-2',
    name: 'storefront-web',
    repository: 'acme-corp/storefront-web',
    framework: 'Next.js',
    runtime: 'Node.js',
    branch: 'main',
    lastDeployment: '18 mins ago',
    status: 'Success',
    dockerfile: `FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]`,
    envVars: [
      { id: '1', key: 'NEXT_PUBLIC_API_URL', value: 'https://api.acme.com/v1', isSecret: false },
      { id: '2', key: 'STRIPE_PUBLIC_KEY', value: 'pk_live_51M0x2213894', isSecret: false },
      { id: '3', key: 'STRIPE_SECRET_KEY', value: 'sk_live_51M0x889123849', isSecret: true }
    ]
  },
  {
    id: 'proj-3',
    name: 'payment-processor',
    repository: 'acme-corp/payment-service',
    framework: 'FastAPI',
    runtime: 'Python',
    branch: 'develop',
    lastDeployment: '1 hour ago',
    status: 'Success',
    dockerfile: `FROM python:3.11-slim
WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    envVars: [
      { id: '1', key: 'REDIS_HOST', value: 'cache.internal.deployshield.net', isSecret: false },
      { id: '2', key: 'PAYMENT_GATEWAY_TOKEN', value: 'gw_live_tok_9918237', isSecret: true }
    ]
  },
  {
    id: 'proj-4',
    name: 'auth-microservice',
    repository: 'acme-corp/auth-service',
    framework: 'Gin',
    runtime: 'Go',
    branch: 'main',
    lastDeployment: '3 hours ago',
    status: 'Success',
    dockerfile: `FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /auth-service

FROM alpine:3.19
COPY --from=build /auth-service /auth-service
EXPOSE 8080
ENTRYPOINT ["/auth-service"]`,
    envVars: [
      { id: '1', key: 'OAUTH_CLIENT_ID', value: 'client_8819237192', isSecret: false },
      { id: '2', key: 'OAUTH_CLIENT_SECRET', value: 'sec_881293819238', isSecret: true }
    ]
  },
  {
    id: 'proj-5',
    name: 'analytics-worker',
    repository: 'acme-corp/analytics-worker',
    framework: 'Spring Boot',
    runtime: 'Java',
    branch: 'feature/kafka-sync',
    lastDeployment: 'Yesterday',
    status: 'Failed',
    dockerfile: `FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]`,
    envVars: [
      { id: '1', key: 'KAFKA_BROKERS', value: 'kafka-1.internal:9092,kafka-2.internal:9092', isSecret: false }
    ]
  },
  {
    id: 'proj-6',
    name: 'order-processing',
    repository: 'acme-corp/order-service',
    framework: 'ASP.NET Core',
    runtime: '.NET',
    branch: 'main',
    lastDeployment: '2 days ago',
    status: 'Success',
    dockerfile: `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "OrderService.dll"]`,
    envVars: [
      { id: '1', key: 'ASPNETCORE_ENVIRONMENT', value: 'Production', isSecret: false }
    ]
  }
];

export const INITIAL_TARGETS: Target[] = [
  { id: 'aws-ec2', name: 'AWS EC2 Cluster', provider: 'Amazon Web Services', type: 'Elastic Compute Cloud', region: 'us-east-1 (N. Virginia)', status: 'Healthy', latencyMs: 18, activeContainers: 14, icon: 'aws' },
  { id: 'digitalocean', name: 'DigitalOcean Droplets', provider: 'DigitalOcean', type: 'K8s Cluster', region: 'nyc1 (New York)', status: 'Healthy', latencyMs: 24, activeContainers: 8, icon: 'digitalocean' },
  { id: 'azure', name: 'Azure Container Apps', provider: 'Microsoft Azure', type: 'Serverless Containers', region: 'eastus2 (Virginia)', status: 'Healthy', latencyMs: 32, activeContainers: 12, icon: 'azure' },
  { id: 'gcp', name: 'Google Cloud Run', provider: 'Google Cloud Platform', type: 'Serverless Platform', region: 'us-central1 (Iowa)', status: 'Healthy', latencyMs: 21, activeContainers: 18, icon: 'gcp' },
  { id: 'railway', name: 'Railway Cluster', provider: 'Railway Inc', type: 'Cloud Platform', region: 'us-west (Oregon)', status: 'Healthy', latencyMs: 29, activeContainers: 6, icon: 'railway' },
  { id: 'render', name: 'Render Native Fleet', provider: 'Render', type: 'Web Service Fleet', region: 'us-east (Ohio)', status: 'Healthy', latencyMs: 35, activeContainers: 5, icon: 'render' },
  { id: 'kubernetes', name: 'Production K8s Engine', provider: 'Kubernetes', type: 'Production K8s v1.28', region: 'multi-region-ha', status: 'Healthy', latencyMs: 12, activeContainers: 32, icon: 'k8s' },
  { id: 'docker-host', name: 'On-Prem Docker Host', provider: 'Self-Hosted Baremetal', type: 'Docker Swarm Host', region: 'datacenter-dc01', status: 'Healthy', latencyMs: 5, activeContainers: 9, icon: 'docker' }
];

export const INITIAL_HISTORY: DeploymentHistoryItem[] = [
  { id: 'dep-901', time: 'Just now', project: 'acme-api-gateway', branch: 'main', commit: '8f2a1b9', commitMsg: 'feat(rate-limit): add Redis sliding window rate limiter', status: 'Success', duration: '1m 24s', target: 'AWS EC2 Cluster', author: 'Alex Rivera' },
  { id: 'dep-900', time: '18 mins ago', project: 'storefront-web', branch: 'main', commit: '3e7c01a', commitMsg: 'fix(checkout): validate promo discount code before charge', status: 'Success', duration: '2m 05s', target: 'Google Cloud Run', author: 'Sarah Chen' },
  { id: 'dep-899', time: '42 mins ago', project: 'analytics-worker', branch: 'feature/kafka-sync', commit: '992b1cd', commitMsg: 'test(kafka): add connection retry logic on broker timeout', status: 'Failed', duration: '48s', target: 'Production K8s Engine', author: 'Marcus Vance' },
  { id: 'dep-898', time: '1 hour ago', project: 'payment-processor', branch: 'develop', commit: '11a00ef', commitMsg: 'chore(deps): bump fastapi to 0.110.0 and uvicorn', status: 'Success', duration: '1m 12s', target: 'Azure Container Apps', author: 'Elena Rostova' },
  { id: 'dep-897', time: '3 hours ago', project: 'auth-microservice', branch: 'main', commit: '556112a', commitMsg: 'security: rotate JWT signing RSA keys in vault', status: 'Success', duration: '56s', target: 'Production K8s Engine', author: 'Alex Rivera' },
  { id: 'dep-896', time: '5 hours ago', project: 'storefront-web', branch: 'main', commit: '00f129a', commitMsg: 'feat(seo): append structured schema graph to product page', status: 'Rolled Back', duration: '1m 45s', target: 'DigitalOcean Droplets', author: 'David Kim' },
  { id: 'dep-895', time: 'Yesterday', project: 'order-processing', branch: 'main', commit: '77d332c', commitMsg: 'perf: optimize SQL query indexes for order history search', status: 'Success', duration: '2m 18s', target: 'AWS EC2 Cluster', author: 'Sarah Chen' }
];

export const INITIAL_CONTAINERS: ContainerStatus[] = [
  { id: 'cnt-101', name: 'api-gateway-prod-1', project: 'acme-api-gateway', status: 'running', cpu: 14.2, ramMb: 184, restarts: 0, uptime: '14d 6h', port: 3000 },
  { id: 'cnt-102', name: 'api-gateway-prod-2', project: 'acme-api-gateway', status: 'running', cpu: 11.8, ramMb: 192, restarts: 0, uptime: '14d 6h', port: 3001 },
  { id: 'cnt-103', name: 'storefront-main-app', project: 'storefront-web', status: 'running', cpu: 22.5, ramMb: 340, restarts: 1, uptime: '3d 12h', port: 8080 },
  { id: 'cnt-104', name: 'payment-service-v2', project: 'payment-processor', status: 'running', cpu: 8.4, ramMb: 128, restarts: 0, uptime: '28d 1h', port: 8000 },
  { id: 'cnt-105', name: 'auth-guard-go', project: 'auth-microservice', status: 'running', cpu: 3.1, ramMb: 64, restarts: 0, uptime: '45d 8h', port: 8080 },
  { id: 'cnt-106', name: 'analytics-ingest', project: 'analytics-worker', status: 'stopped', cpu: 0, ramMb: 0, restarts: 4, uptime: 'Stopped', port: 9090 }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: '14:22:10.842', service: 'deploy-shield-runner', level: 'INFO', message: 'Connected to Github Webhook Stream: acme-corp/api-gateway' },
  { id: 'log-2', timestamp: '14:22:11.104', service: 'pipeline-validator', level: 'SUCCESS', message: 'Pre-flight check passed: Repository commit 8f2a1b9 verified with GPG signature.' },
  { id: 'log-3', timestamp: '14:22:12.391', service: 'docker-builder', level: 'INFO', message: 'Step 1/8 : FROM node:20-alpine AS builder' },
  { id: 'log-4', timestamp: '14:22:14.022', service: 'docker-builder', level: 'INFO', message: 'Step 2/8 : RUN npm ci -> cache hit [sha256:7b91...]' },
  { id: 'log-5', timestamp: '14:22:18.450', service: 'docker-builder', level: 'SUCCESS', message: 'Successfully built image sha256:e3b0c44298fc (142.8MB)' },
  { id: 'log-6', timestamp: '14:22:19.120', service: 'target-deployer', level: 'INFO', message: 'Deploying image tag v2.4.12 to AWS EC2 Cluster (us-east-1)...' },
  { id: 'log-7', timestamp: '14:22:21.890', service: 'target-deployer', level: 'INFO', message: 'Health probe HTTP GET /healthz returned 200 OK in 14ms' },
  { id: 'log-8', timestamp: '14:22:22.001', service: 'domain-router', level: 'SUCCESS', message: 'SSL Certificate active. Traffic cutover completed seamlessly.' },
  { id: 'log-9', timestamp: '14:22:25.100', service: 'monitoring-agent', level: 'WARN', message: 'Memory consumption spiked to 68% during cold start initial load' },
  { id: 'log-10', timestamp: '14:22:28.441', service: 'monitoring-agent', level: 'INFO', message: 'Memory utilization stabilized at 28% (184 MB allocated)' }
];

export const INITIAL_DNS_RECORDS: DNSRecord[] = [
  { type: 'A', name: '@', value: '76.76.21.21', ttl: '300', status: 'Verified' },
  { type: 'CNAME', name: 'www', value: 'cname.deployshield.app', ttl: '300', status: 'Verified' },
  { type: 'TXT', name: '_deployshield-challenge', value: 'deploy-shield-verify-token-x9918237192', ttl: '300', status: 'Verified' }
];
