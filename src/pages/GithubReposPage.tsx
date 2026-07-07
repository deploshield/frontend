import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GitBranch, Building2, ArrowLeft, Loader2, ExternalLink, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import api from '../api/client';
import { githubApi, GithubRepo } from '../api/github';
import { projectsApi } from '../api/projects';

interface GithubOrg {
  login: string;
  avatar_url: string;
  description?: string;
}

export function GithubReposPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as 'repos' | 'orgs' | null;

  const [tab, setTab] = useState<'repos' | 'orgs'>(initialTab || 'repos');
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [orgs, setOrgs] = useState<GithubOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<GithubOrg | null>(null);
  const [importModal, setImportModal] = useState<GithubRepo | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (user) {
      if (tab === 'repos') {
        fetchRepos();
      } else {
        fetchOrgs();
      }
    }
  }, [user, tab]);

  const fetchRepos = async (org?: string) => {
    if (!user) return;
    setLoading(true);
    try {
      if (org) {
        const data = await api.get<GithubRepo[]>(`/github/orgs/${org}/repos`, { params: { clerk_user_id: user.id } }).then(r => r.data);
        setRepos(data);
      } else {
        const data = await githubApi.repos(user.id);
        setRepos(data);
      }
    } catch {
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get<GithubOrg[]>('/github/orgs', { params: { clerk_user_id: user.id } }).then(r => r.data);
      setOrgs(data);
    } catch {
      setOrgs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSelect = (org: GithubOrg) => {
    setSelectedOrg(org);
    setTab('repos');
    fetchRepos(org.login);
  };

  const clearOrgFilter = () => {
    setSelectedOrg(null);
    fetchRepos();
  };

  const handleImport = async () => {
    if (!importModal) return;
    setImporting(true);
    try {
      await projectsApi.create({
        name: importModal.full_name.split('/')[1] || importModal.full_name,
        repo_url: importModal.html_url,
        branch: importModal.default_branch || 'main',
      });
      setImportModal(null);
      navigate('/projects');
    } catch {
      // error
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">GitHub</h1>
          <p className="text-xs text-slate-500">Browse and import repositories</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#E5E7EB] p-1">
        <button
          onClick={() => { setTab('repos'); if (!selectedOrg) fetchRepos(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${tab === 'repos' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          Repositories
        </button>
        <button
          onClick={() => { setTab('orgs'); setSelectedOrg(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${tab === 'orgs' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Organizations
        </button>
      </div>

      {/* Org filter bar */}
      {selectedOrg && tab === 'repos' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
          <img src={selectedOrg.avatar_url} alt="" className="w-5 h-5 rounded" />
          <span className="text-xs font-semibold text-blue-800">Showing repos from: {selectedOrg.login}</span>
          <button onClick={clearOrgFilter} className="ml-auto text-xs font-bold text-blue-600 hover:underline cursor-pointer">
            Show all
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : tab === 'repos' ? (
        <div className="space-y-2">
          {repos.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No repositories found</p>
            </div>
          ) : (
            repos.map(repo => (
              <button
                key={repo.id}
                onClick={() => setImportModal(repo)}
                className="w-full text-left bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <GitBranch className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{repo.full_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {repo.default_branch || 'main'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-blue-600 p-1 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {orgs.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No organizations found</p>
            </div>
          ) : (
            orgs.map(org => (
              <button
                key={org.login}
                onClick={() => handleOrgSelect(org)}
                className="w-full text-left bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={org.avatar_url} alt="" className="w-9 h-9 rounded-xl" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{org.login}</p>
                    {org.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{org.description}</p>
                    )}
                  </div>
                </div>
                <GitBranch className="w-4 h-4 text-slate-400" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Import Confirmation Modal */}
      {importModal && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={() => setImportModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setImportModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <GitBranch className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Import Repository</h3>
              <p className="text-xs text-slate-500 mt-1">
                Add <span className="font-bold text-slate-700">"{importModal.full_name}"</span> as a new project?
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Repository</span>
                <span className="text-xs font-medium text-slate-800">{importModal.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Branch</span>
                <span className="text-xs font-medium text-slate-800">{importModal.default_branch || 'main'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setImportModal(null)}
                className="flex-1 py-2.5 border border-[#E5E7EB] text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Import
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
