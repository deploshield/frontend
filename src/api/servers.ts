import api from './client';

export interface Server {
  id: string;
  name: string;
  target_type: string;
  deploy_method: string;
  ip_address?: string;
  ssh_user?: string;
  ssh_port?: number;
  domain?: string;
  setup_nginx: boolean;
  setup_ssl: boolean;
  app_port: number;
  env_variables?: Record<string, string>;
  created_at?: string;
}

export interface ServerCreate {
  name: string;
  target_type: string;
  deploy_method: string;
  ip_address?: string;
  ssh_user?: string;
  ssh_port?: number;
  ssh_private_key?: string;
  ssh_password?: string;
  domain?: string;
  setup_nginx?: boolean;
  setup_ssl?: boolean;
  app_port?: number;
  env_variables?: Record<string, string>;
}

export const serversApi = {
  list: () => api.get<Server[]>('/servers/').then(r => r.data),
  get: (id: string) => api.get<Server>(`/servers/${id}`).then(r => r.data),
  create: (data: ServerCreate) => api.post<Server>('/servers/', data).then(r => r.data),
  update: (id: string, data: ServerCreate) => api.put<Server>(`/servers/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/servers/${id}`).then(r => r.data),
};
