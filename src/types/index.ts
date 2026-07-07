export type TabType = 'pipeline' | 'projects' | 'targets' | 'history' | 'monitoring' | 'logs' | 'settings';

export type EnvironmentType = 'Development' | 'Staging' | 'Production';

export type RuntimeType = 'Node.js' | 'Python' | 'Java' | 'Go' | '.NET';

export type FrameworkType = 'Next.js' | 'Express.js' | 'FastAPI' | 'Spring Boot' | 'Gin' | 'ASP.NET Core';

export type TargetId = 'aws-ec2' | 'digitalocean' | 'azure' | 'gcp' | 'railway' | 'render' | 'kubernetes' | 'docker-host';

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface Target {
  id: TargetId;
  name: string;
  provider: string;
  type: string;
  region: string;
  status: 'Healthy' | 'Ready' | 'Deploying' | 'Degraded';
  latencyMs: number;
  activeContainers: number;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  repository: string;
  framework: FrameworkType;
  runtime: RuntimeType;
  branch: string;
  lastDeployment: string;
  status: 'Success' | 'Failed' | 'Building' | 'Queued';
  dockerfile: string;
  envVars: EnvVariable[];
}

export interface DeploymentHistoryItem {
  id: string;
  time: string;
  project: string;
  branch: string;
  commit: string;
  commitMsg: string;
  status: 'Success' | 'Failed' | 'Building' | 'Rolled Back';
  duration: string;
  target: string;
  author: string;
}

export interface ContainerStatus {
  id: string;
  name: string;
  project: string;
  status: 'running' | 'restarting' | 'stopped';
  cpu: number;
  ramMb: number;
  restarts: number;
  uptime: string;
  port: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
  message: string;
}

export interface DNSRecord {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  ttl: string;
  status: 'Verified' | 'Pending' | 'Error';
}
