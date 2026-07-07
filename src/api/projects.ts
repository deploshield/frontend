import api from './client';

export interface Project {
  id: string;
  name: string;
  repo_url: string;
  branch: string;
  created_at?: string;
}

export interface ProjectCreate {
  name: string;
  repo_url: string;
  branch: string;
}

export const projectsApi = {
  list: () => api.get<Project[]>('/projects/').then(r => r.data),
  get: (id: string) => api.get<Project>(`/projects/${id}`).then(r => r.data),
  create: (data: ProjectCreate) => api.post<Project>('/projects/', data).then(r => r.data),
  update: (id: string, data: ProjectCreate) => api.put<Project>(`/projects/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/projects/${id}`).then(r => r.data),
};
