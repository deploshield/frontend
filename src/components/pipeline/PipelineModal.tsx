import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Rocket, Cloud, Globe, CheckCircle2, XCircle, Loader2, ChevronDown } from 'lucide-react';
import { projectsApi, Project } from '../../api/projects';
import { serversApi, Server } from '../../api/servers';
import { deploymentsApi } from '../../api/deployments';
import api from '../../api/client';
import { StageList } from './StageList';
import { AIAnalysis } from './AIAnalysis';

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'validate' | 'deploy' | 'domain' | 'done';

export const PipelineModal: React.FC<PipelineModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('validate');
  const [projects, setProjects] = useState<Project[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedServer, setSelectedServer] = useState('');
  const [envVars, setEnvVars] = useState('');
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [validateResult, setValidateResult] = useState<any>(null);
  const [deployResult, setDeployResult] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [domainResult, setDomainResult] = useState<any>(null);
  const timerRef = useRef<number | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      Promise.all([projectsApi.list(), serversApi.list()]).then(([p, s]) => {
        setProjects(p);
        setServers(s);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (running) {
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const pollDeployment = async (id: string): Promise<any> => {
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 2500));
      const dep = await deploymentsApi.get(id);
      if (dep.status !== 'running') return dep;
    }
    return { status: 'failed', result: { error: 'Timeout: deployment took too long' } };
  };

  const handleValidate = async () => {
    if (!selectedProject) return;
    setRunning(true);
    setValidateResult(null);
    try {
      const dep = await api.post('/deployments/validate', {
        project_id: selectedProject,
        env_vars: envVars || null,
      }).then(r => r.data);
      const result = await pollDeployment(dep.id);
      setValidateResult(result);
    } catch (err: any) {
      setValidateResult({ status: 'failed', result: { error: err.message || 'Validation failed' } });
    } finally {
      setRunning(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedServer) return;
    setRunning(true);
    setDeployResult(null);
    try {
      const dep = await api.post('/deployments/deploy', {
        project_id: selectedProject,
        server_id: selectedServer,
        env_vars: envVars || null,
      }).then(r => r.data);
      const result = await pollDeployment(dep.id);
      setDeployResult(result);
    } catch (err: any) {
      setDeployResult({ status: 'failed', result: { error: err.message || 'Deployment failed' } });
    } finally {
      setRunning(false);
    }
  };

  const handleDomain = async () => {
    if (!domain || !deployResult?.id) return;
    setRunning(true);
    try {
      const result = await api.post(`/deployments/${deployResult.id}/setup-domain`, {
        domain,
        setup_ssl: true,
      }).then(r => r.data);
      setDomainResult(result);
      setStep('done');
    } catch (err: any) {
      setDomainResult({ error: err.message || 'Domain setup failed' });
    } finally {
      setRunning(false);
    }
  };

  const resetPipeline = () => {
    setStep('validate');
    setSelectedProject('');
    setSelectedServer('');
    setEnvVars('');
    setShowEnvVars(false);
    setValidateResult(null);
    setDeployResult(null);
    setDomain('');
    setDomainResult(null);
    setRunning(false);
    setElapsed(0);
  };

  const handleClose = () => {
    resetPipeline();
    onClose();
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'validate', label: 'Validate', num: 1 },
    { key: 'deploy', label: 'Deploy', num: 2 },
    { key: 'domain', label: 'Domain', num: 3 },
  ];

  const currentStepIndex = step === 'done' ? 3 : steps.findIndex(s => s.key === step);

  if (!isOpen) return null;

  const selectedProjectObj = projects.find(p => p.id === selectedProject);
  const selectedServerObj = servers.find(s => s.id === selectedServer);

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900">Run Pipeline</h2>
            <p className="text-xs text-slate-500">Validate, deploy & configure</p>
          </div>
          <button onClick={handleClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i < currentStepIndex ? 'bg-emerald-500 text-white' :
                    i === currentStepIndex ? 'bg-blue-600 text-white' :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {i < currentStepIndex ? '✓' : s.num}
                  </div>
                  <span className={`text-[11px] font-semibold ${
                    i <= currentStepIndex ? 'text-slate-800' : 'text-slate-400'
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded-full ${i < currentStepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Running State */}
          {running && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-slate-800">
                {step === 'validate' ? 'Validating your code...' : step === 'deploy' ? 'Deploying to server...' : 'Setting up domain...'}
              </p>
              <span className="text-xs text-slate-500 font-mono">{formatElapsed(elapsed)}</span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {/* Step 1: Validate */}
          {step === 'validate' && !running && (
            <>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Pre-Deploy Validation</p>
                  <p className="text-[11px] text-slate-500">Check code, build Docker image & test startup</p>
                </div>
              </div>

              {/* Project Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Project</label>
                <div className="relative">
                  <button
                    onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <span className={selectedProjectObj ? 'text-slate-900' : 'text-slate-400'}>
                      {selectedProjectObj?.name || 'Choose a project...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {projectDropdownOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                      {projects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedProject(p.id); setProjectDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                            selectedProject === p.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                      {projects.length === 0 && (
                        <p className="px-3 py-2 text-xs text-slate-500">No projects found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Env Vars Toggle */}
              <button
                onClick={() => setShowEnvVars(!showEnvVars)}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {showEnvVars ? '— Hide' : '+ Add'} Environment Variables (optional)
              </button>
              {showEnvVars && (
                <textarea
                  placeholder="KEY=value&#10;ANOTHER_KEY=value"
                  value={envVars}
                  onChange={(e) => setEnvVars(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 text-xs font-mono bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              )}

              {/* Validation Result */}
              {validateResult && (
                <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                    validateResult.result?.success ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}>
                    {validateResult.result?.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <div>
                      <p className={`text-xs font-bold ${validateResult.result?.success ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {validateResult.result?.success ? 'Validation Passed' : 'Validation Failed'}
                      </p>
                      {validateResult.result?.message && (
                        <p className="text-[11px] text-slate-600 mt-0.5">{validateResult.result.message}</p>
                      )}
                      {validateResult.result?.error && (
                        <p className="text-[11px] text-rose-600 mt-0.5">{validateResult.result.error}</p>
                      )}
                    </div>
                  </div>

                  {validateResult.result?.stages && <StageList stages={validateResult.result.stages} />}
                  {validateResult.result?.ai_analysis && <AIAnalysis analysis={validateResult.result.ai_analysis} />}
                </div>
              )}

              {/* Action Buttons */}
              {validateResult?.result?.success ? (
                <button
                  onClick={() => setStep('deploy')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  Continue to Deploy
                </button>
              ) : (
                <button
                  onClick={handleValidate}
                  disabled={!selectedProject}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  {validateResult ? 'Retry Validation' : 'Run Validation'}
                </button>
              )}
            </>
          )}

          {/* Step 2: Deploy */}
          {step === 'deploy' && !running && (
            <>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Deploy to Server</p>
                  <p className="text-[11px] text-slate-500">Push your validated build to the target</p>
                </div>
              </div>

              {/* Server Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Server</label>
                <div className="relative">
                  <button
                    onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <span className={selectedServerObj ? 'text-slate-900' : 'text-slate-400'}>
                      {selectedServerObj ? `${selectedServerObj.name} (${selectedServerObj.target_type})` : 'Choose a server...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${serverDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {serverDropdownOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                      {servers.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedServer(s.id); setServerDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                            selectedServer === s.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {s.name} ({s.target_type})
                        </button>
                      ))}
                      {servers.length === 0 && (
                        <p className="px-3 py-2 text-xs text-slate-500">No servers found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {envVars && (
                <p className="text-[11px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-[#E5E7EB]">
                  {envVars.split('\n').filter(Boolean).length} env variable(s) will be applied
                </p>
              )}

              {/* Deploy Result */}
              {deployResult && (
                <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                    deployResult.result?.success ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}>
                    {deployResult.result?.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <div>
                      <p className={`text-xs font-bold ${deployResult.result?.success ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {deployResult.result?.success ? 'Deployed Successfully' : 'Deployment Failed'}
                      </p>
                      {deployResult.result?.url && (
                        <a href={deployResult.result.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3" /> {deployResult.result.url}
                        </a>
                      )}
                      {deployResult.result?.error && (
                        <p className="text-[11px] text-rose-600 mt-0.5">{deployResult.result.error}</p>
                      )}
                    </div>
                  </div>
                  {deployResult.result?.stages && <StageList stages={deployResult.result.stages} />}
                </div>
              )}

              {/* Action Buttons */}
              {deployResult?.result?.success ? (
                <button
                  onClick={() => setStep('domain')}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Continue to Domain Setup
                </button>
              ) : (
                <button
                  onClick={handleDeploy}
                  disabled={!selectedServer}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  {deployResult ? 'Retry Deploy' : 'Deploy Now'}
                </button>
              )}
            </>
          )}

          {/* Step 3: Domain */}
          {step === 'domain' && !running && (
            <>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Custom Domain (Optional)</p>
                  <p className="text-[11px] text-slate-500">Setup Nginx reverse proxy + SSL certificate</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
                <input
                  type="text"
                  placeholder="app.example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {domainResult?.error && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700">{domainResult.error}</p>
                </div>
              )}

              <button
                onClick={handleDomain}
                disabled={!domain}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Setup Domain & SSL
              </button>

              <button
                onClick={() => setStep('done')}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                Skip this step
              </button>
            </>
          )}

          {/* Step 4: Done */}
          {step === 'done' && !running && (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">All Done!</h3>
              <p className="text-xs text-slate-500 text-center">
                Your application has been validated and deployed successfully.
              </p>
              {(domainResult?.url || deployResult?.result?.url) && (
                <a
                  href={domainResult?.url || deployResult?.result?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {domainResult?.url || deployResult?.result?.url}
                </a>
              )}
              <button
                onClick={resetPipeline}
                className="mt-2 px-6 py-2.5 border border-[#E5E7EB] text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Start New Deployment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
