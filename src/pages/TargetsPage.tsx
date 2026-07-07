import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Server, Cloud, Pencil, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { serversApi, type Server as ServerType } from '../api/servers';

const TARGET_TYPE_OPTIONS = [
  { label: 'KVM / VPS', value: 'kvm' },
  { label: 'AWS EC2', value: 'ec2' },
  { label: 'Generic VPS', value: 'vps' },
  { label: 'Google Cloud Run', value: 'cloud_run' },
];

const DEPLOY_METHOD_OPTIONS = [
  { label: 'Docker Container', value: 'container' },
  { label: 'Webserver (pm2)', value: 'webserver' },
];

const AUTH_OPTIONS = [
  { label: 'Password', value: 'password' },
  { label: 'SSH Key (paste)', value: 'key' },
];

export function TargetsPage() {
  const [targets, setTargets] = useState<ServerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<ServerType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ServerType | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState('kvm');
  const [deployMethod, setDeployMethod] = useState('container');
  const [ip, setIp] = useState('');
  const [sshUser, setSshUser] = useState('root');
  const [sshPort, setSshPort] = useState('22');
  const [appPort, setAppPort] = useState('3000');
  const [authMethod, setAuthMethod] = useState('password');
  const [password, setPassword] = useState('');
  const [sshKey, setSshKey] = useState('');
  const [domain, setDomain] = useState('');
  const [envVars, setEnvVars] = useState('');

  const fetchTargets = async () => {
    try {
      const data = await serversApi.list();
      setTargets(data);
    } catch (err) {
      console.error('Failed to fetch targets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTargets(); }, []);

  const resetForm = () => {
    setName(''); setTargetType('kvm'); setDeployMethod('container');
    setIp(''); setSshUser('root'); setSshPort('22'); setAppPort('3000');
    setAuthMethod('password'); setPassword(''); setSshKey(''); setDomain('');
    setEnvVars('');
  };

  const openCreate = () => {
    setSelected(null);
    setModalMode('create');
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (target: ServerType) => {
    setSelected(target);
    setModalMode('edit');
    setName(target.name);
    setTargetType(target.target_type);
    setDeployMethod(target.deploy_method);
    setIp(target.ip_address || '');
    setSshUser(target.ssh_user || 'root');
    setSshPort(String(target.ssh_port || 22));
    setAppPort(String(target.app_port || 3000));
    setDomain(target.domain || '');
    setEnvVars(target.env_variables ? Object.entries(target.env_variables).map(([k, v]) => `${k}=${v}`).join('\n') : '');
    setModalOpen(true);
  };

  const parseEnvVars = (raw: string): Record<string, string> | undefined => {
    if (!raw.trim()) return undefined;
    const result: Record<string, string> = {};
    raw.split('\n').forEach(line => {
      const idx = line.indexOf('=');
      if (idx > 0) result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    return Object.keys(result).length > 0 ? result : undefined;
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (targetType !== 'cloud_run' && !ip.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        target_type: targetType,
        deploy_method: deployMethod,
        ip_address: ip.trim() || undefined,
        ssh_user: sshUser.trim() || 'root',
        ssh_port: parseInt(sshPort) || 22,
        app_port: parseInt(appPort) || 3000,
        domain: domain.trim() || undefined,
        env_variables: parseEnvVars(envVars),
        ...(authMethod === 'password' && password ? { ssh_password: password } : {}),
        ...(authMethod === 'key' && sshKey ? { ssh_private_key: sshKey } : {}),
      };

      if (modalMode === 'edit' && selected) {
        await serversApi.update(selected.id, payload);
      } else {
        await serversApi.create(payload);
      }
      setModalOpen(false);
      fetchTargets();
    } catch (err) {
      console.error('Failed to save target', err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await serversApi.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchTargets();
    } catch (err) {
      console.error('Failed to delete target', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Targets</h1>
          <p className="text-xs text-slate-500 mt-0.5">{targets.length} server{targets.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Target</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : targets.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Server className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">No targets yet</p>
          <p className="text-xs text-slate-500 mt-1">Add a server to deploy your projects</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targets.map((target) => (
            <div
              key={target.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-soft"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  target.target_type === 'cloud_run' ? 'bg-emerald-50' : 'bg-blue-50'
                }`}>
                  {target.target_type === 'cloud_run' ? (
                    <Cloud className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Server className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900">{target.name}</p>
                <p className="text-xs text-slate-500 mt-1">{target.ip_address || target.domain || 'Cloud Run'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                    {target.target_type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60">
                    {target.deploy_method}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(target)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-blue-600 transition-colors cursor-pointer">
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button onClick={() => setDeleteConfirm(target)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer">
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
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? 'New Target' : 'Edit Target'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
                <input type="text" placeholder="Production Server" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select value={targetType} onChange={(e) => setTargetType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  {TARGET_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deploy Method</label>
                <select value={deployMethod} onChange={(e) => setDeployMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  {DEPLOY_METHOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {targetType !== 'cloud_run' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">IP Address</label>
                      <input type="text" placeholder="103.x.x.x" value={ip} onChange={(e) => setIp(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">SSH Port</label>
                      <input type="text" value={sshPort} onChange={(e) => setSshPort(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">SSH User</label>
                      <input type="text" value={sshUser} onChange={(e) => setSshUser(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">App Port</label>
                      <input type="text" value={appPort} onChange={(e) => setAppPort(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Method</label>
                    <select value={authMethod} onChange={(e) => setAuthMethod(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      {AUTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  {authMethod === 'password' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <input type="password" placeholder={modalMode === 'edit' ? '(unchanged)' : 'SSH password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Private Key</label>
                      <textarea placeholder={modalMode === 'edit' ? '(unchanged)' : '-----BEGIN RSA...'} value={sshKey} onChange={(e) => setSshKey(e.target.value)} rows={3}
                        className="w-full px-3 py-2 text-sm font-mono bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                  )}
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domain (optional)</label>
                <input type="text" placeholder="app.example.com" value={domain} onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Environment Variables</label>
                <textarea placeholder={"DATABASE_URL=postgres://...\nSECRET_KEY=mysecret"} value={envVars} onChange={(e) => setEnvVars(e.target.value)} rows={3}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
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
                <h2 className="text-sm font-bold text-slate-900">Delete Target</h2>
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
