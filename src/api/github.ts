import api from './client';

export interface GithubRepo {
  id: number;
  full_name: string;
  html_url: string;
  default_branch: string;
}

export const githubApi = {
  repos: (clerkUserId: string) =>
    api.get<GithubRepo[]>('/github/repos', { params: { clerk_user_id: clerkUserId } }).then(r => r.data),
  branches: (owner: string, repo: string, clerkUserId: string) =>
    api.get<{ name: string }[]>(`/github/repos/${owner}/${repo}/branches`, { params: { clerk_user_id: clerkUserId } }).then(r => r.data),
};
