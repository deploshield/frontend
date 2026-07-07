import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, GitBranch, Pencil, Trash2, X, FolderOpen, AlertTriangle, Loader2 } from 'lucide-react';
import { projectsApi, type Project } from '../api/projects';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setSelected(null);
    setModalMode('create');
    setName('');
    setRepoUrl('');
    setBranch('main');
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setSelected(project);
    setModalMode('edit');
    setName(project.name);
    setRepoUrl(project.repo_url);
    setBranch(project.branch);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !repoUrl.trim()) return;
    setSaving(true);
    try {
      if (modalMode === 'edit' && selected) {
        await projectsApi.update(selected.id, { name: name.trim(), repo_url: repoUrl.trim(), branch: branch.trim() || 'main' });
      } else {
        await projectsApi.create({ name: name.trim(), repo_url: repoUrl.trim(), branch: branch.trim() || 'main' });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save project', err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await projectsApi.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">No projects yet</p>
          <p className="text-xs text-slate-500 mt-1">Add your first project to start deploying</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-soft"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-slate-900">{project.name}</p>
                <p className="text-xs text-slate-500 font-mono truncate mt-1">{project.repo_url}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  <GitBranch className="w-2.5 h-2.5" />
                  <span className="text-[10px] font-semibold">{project.branch}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(project)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-blue-600 transition-colors cursor-pointer">
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button onClick={() => setDeleteConfirm(project)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? 'New Project' : 'Edit Project'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                <input type="text" placeholder="my-awesome-app" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Repository URL</label>
                <input type="text" placeholder="https://github.com/user/repo.git" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <input type="text" placeholder="main" value={branch} onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 bg-white border border-[#E5E7EB] text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {modalMode === 'edit' ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {deleteConfirm && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Delete Project</h2>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-700">
              Are you sure you want to delete <span className="font-bold">{deleteConfirm.name}</span>?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-white border border-[#E5E7EB] text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
