import api from './client';

export interface Deployment {
  id: string;
  project_id: string;
  server_id?: string;
  status: string;
  trigger_type: string;
  result?: {
    success?: boolean;
    stages?: { name: string; status: string; message?: string }[];
    url?: string;
    error?: string;
  };
  started_at?: string;
  completed_at?: string;
}

export const deploymentsApi = {
  list: (page = 1, perPage = 50) =>
    api.get<Deployment[]>('/deployments/', { params: { page, per_page: perPage } }).then(r => r.data),
  get: (id: string) => api.get<Deployment>(`/deployments/${id}`).then(r => r.data),
};
