import React, { useState } from 'react';
import { 
  Play, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  Sparkles,
  Loader2,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Project, EnvironmentType, RuntimeType, EnvVariable } from '../types';

interface StepValidationProps {
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: (p: Project) => void;
  selectedEnv: EnvironmentType;
  setSelectedEnv: (e: EnvironmentType) => void;
  selectedBranch: string;
  setSelectedBranch: (b: string) => void;
  selectedRuntime: RuntimeType;
  setSelectedRuntime: (r: RuntimeType) => void;
  envVars: EnvVariable[];
  setEnvVars: React.Dispatch<React.SetStateAction<EnvVariable[]>>;
  onValidationComplete: () => void;
}

export const StepValidation: React.FC<StepValidationProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
  selectedEnv,
  setSelectedEnv,
  selectedBranch,
  setSelectedBranch,
  selectedRuntime,
  setSelectedRuntime,
  envVars,
  setEnvVars,
  onValidationComplete,
}) => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [isEnvExpanded, setIsEnvExpanded] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationLogs, setValidationLogs] = useState<string[]>([
    '✓ Repository metadata validated',
    '✓ Branch reference HEAD resolved to commit 8f2a1b9',
    '✓ Environment variables encrypted with AES-256-GCM',
    '✓ Target runner connectivity initialized'
  ]);
  const [healthScore, setHealthScore] = useState(95);

  const handleAddEnv = () => {
    const newVar: EnvVariable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      isSecret: true,
    };
    setEnvVars([...envVars, newVar]);
  };

  const handleUpdateEnv = (id: string, field: 'key' | 'value' | 'isSecret', val: any) => {
    setEnvVars(envVars.map(v => v.id === id ? { ...v, [field]: val } : v));
  };

  const handleRemoveEnv = (id: string) => {
    setEnvVars(envVars.filter(v => v.id !== id));
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setValidationLogs([
      '⚡ Starting Pre-Deploy Validation pipeline...'
    ]);

    const steps = [
      '✓ Checking GitHub repository access & signature...',
      '✓ Fetching package manifests and lock files...',
      '✓ Installing production dependencies (cached 98%)...',
      '✓ Testing Docker multi-stage build configuration...',
      '✓ Executing container startup simulation test...',
      '✓ Verifying REST health check endpoint GET /healthz...',
      '✓ Pre-deploy security scan passed: 0 vulnerabilities found!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setValidationLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setHealthScore(98);
        }
      }, (index + 1) * 450);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Validation Form Card (Left Column) */}
      <div className="lg:col-span-7 bg-white card-18 p-6 border border-[#E5E7EB] shadow-soft">
        
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Pre-Deploy Validation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Check repository, install dependencies, build Docker image, run startup test and verify application health.
          </p>
        </div>

        {/* Fields Grid */}
        <div className="space-y-5">
          
          {/* Project Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Project
            </label>
            <div className="relative">
              <select
                value={selectedProject.id}
                onChange={(e) => {
                  const proj = projects.find(p => p.id === e.target.value);
                  if (proj) {
                    setSelectedProject(proj);
                    setSelectedBranch(proj.branch);
                    setSelectedRuntime(proj.runtime);
                  }
                }}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs font-bold bg-[#F8F4EC] border border-[#E5E7EB] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.repository})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Environment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Environment
              </label>
              <div className="relative">
                <select
                  value={selectedEnv}
                  onChange={(e) => setSelectedEnv(e.target.value as EnvironmentType)}
                  className="w-full pl-3 pr-8 py-2.5 text-xs font-bold bg-[#F8F4EC] border border-[#E5E7EB] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Branch
              </label>
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 text-xs font-bold bg-[#F8F4EC] border border-[#E5E7EB] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                >
                  <option value="main">main</option>
                  <option value="develop">develop</option>
                  <option value="feature/kafka-sync">feature/kafka-sync</option>
                  <option value="feature/auth-v2">feature/auth-v2</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Runtime */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Runtime
              </label>
              <div className="relative">
                <select
                  value={selectedRuntime}
                  onChange={(e) => setSelectedRuntime(e.target.value as RuntimeType)}
                  className="w-full pl-3 pr-8 py-2.5 text-xs font-bold bg-[#F8F4EC] border border-[#E5E7EB] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                >
                  <option value="Node.js">Node.js</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Go">Go</option>
                  <option value=".NET">.NET</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Environment Variables (Expandable Key-Value Editor) */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8F4EC]/60">
            <button
              type="button"
              onClick={() => setIsEnvExpanded(!isEnvExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-700 hover:bg-[#F8F4EC] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Environment Variables ({envVars.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] normal-case font-medium text-slate-500">
                  {showSecrets ? 'Secrets Visible' : 'Secrets Hidden'}
                </span>
                {isEnvExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isEnvExpanded && (
              <div className="p-4 border-t border-[#E5E7EB] space-y-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">
                    Key-Value Editor (Variables encrypted at rest)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    {showSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSecrets ? 'Hide Secrets' : 'Reveal Secrets'}</span>
                  </button>
                </div>

                {envVars.map((env) => (
                  <div key={env.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="KEY (e.g. DATABASE_URL)"
                      value={env.key}
                      onChange={(e) => handleUpdateEnv(env.id, 'key', e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#F8F4EC] border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <div className="flex-1 relative">
                      <input
                        type={env.isSecret && !showSecrets ? "password" : "text"}
                        placeholder="VALUE"
                        value={env.value}
                        onChange={(e) => handleUpdateEnv(env.id, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F4EC] border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateEnv(env.id, 'isSecret', !env.isSecret)}
                      title={env.isSecret ? "Secret Key" : "Plaintext Variable"}
                      className={`px-2 py-1 text-[10px] font-extrabold rounded cursor-pointer ${
                        env.isSecret
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {env.isSecret ? 'Secret' : 'Plain'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveEnv(env.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddEnv}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variable</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              {/* Primary Run Validation Button */}
              <button
                type="button"
                onClick={handleRunValidation}
                disabled={isValidating}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Validation</span>
                  </>
                )}
              </button>

              {/* Save Draft Button */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8F4EC] text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onValidationComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Proceed to Build Step</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Validation Console & Health Score (Right Column) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        
        {/* Terminal Console */}
        <div className="bg-slate-950 text-slate-100 card-18 p-5 border border-slate-800 shadow-xl flex-1 flex flex-col font-mono text-xs overflow-hidden">
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-slate-400 font-bold text-xs ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                Validation Console
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] lg:max-h-[360px] pr-2 text-slate-300">
            {validationLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-400 font-bold shrink-0">➔</span>
                <span className={log.includes('✓') ? 'text-emerald-300 font-medium' : 'text-slate-200'}>
                  {log}
                </span>
              </div>
            ))}

            {isValidating && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse pt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running container security checks & AST linting...</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Branch: <strong className="text-blue-400">{selectedBranch}</strong></span>
            <span>Status: <strong className="text-emerald-400">PASSED</strong></span>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-800/50 card-18 p-5 text-white shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Health Score</h3>
            </div>
            <p className="text-xs text-blue-200/80">
              Optimal configuration. Ready for Docker multi-stage compilation.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-blue-600/30 border border-blue-500/40 rounded-2xl p-3 min-w-[90px]">
            <span className="text-3xl font-extrabold text-emerald-400">{healthScore}%</span>
            <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Verified</span>
          </div>
        </div>

      </div>

    </div>
  );
};
