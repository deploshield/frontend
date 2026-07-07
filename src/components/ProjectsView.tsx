import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  GitBranch, 
  Code2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  Play, 
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onTriggerPipelineForProject: (p: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onTriggerPipelineForProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuntimeFilter, setSelectedRuntimeFilter] = useState<string>('ALL');
  const [inspectProject, setInspectProject] = useState<Project | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'dockerfile' | 'env'>('dockerfile');
  const [showSecrets, setShowSecrets] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.repository.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRuntime = selectedRuntimeFilter === 'ALL' || p.runtime === selectedRuntimeFilter;
    return matchesSearch && matchesRuntime;
  });

  const handleCopyDockerfile = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Controls Bar */}
      <div className="bg-white card-18 p-5 border border-[#E5E7EB] shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search projects or repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F4EC] border border-[#E5E7EB] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filter by Runtime */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['ALL', 'Node.js', 'Python', 'Go', 'Java', '.NET'].map((rt) => (
              <button
                key={rt}
                onClick={() => setSelectedRuntimeFilter(rt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRuntimeFilter === rt
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#F8F4EC] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {rt}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isSuccess = project.status === 'Success';
          return (
            <div
              key={project.id}
              className="bg-white card-18 p-5 border border-[#E5E7EB] shadow-soft shadow-soft-hover transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#F8F4EC] text-slate-700">
                      {project.runtime}
                    </span>
                  </div>

                  <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isSuccess
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                  }`}>
                    {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{project.status}</span>
                  </div>
                </div>

                {/* Project Title & Repo */}
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.repository}</span>
                </p>

                {/* Details Pills */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono text-slate-800 font-bold">{project.branch}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.lastDeployment}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setInspectProject(project)}
                  className="px-3.5 py-1.5 bg-[#F8F4EC] hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Project Details
                </button>

                <button
                  type="button"
                  onClick={() => onTriggerPipelineForProject(project)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Trigger Deploy</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Project Details Modal */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white card-18 w-full max-w-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {inspectProject.name}
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-extrabold rounded bg-blue-100 text-blue-700">
                    {inspectProject.framework}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  GitHub: {inspectProject.repository}
                </p>
              </div>

              <button
                onClick={() => setInspectProject(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-[#F8F4EC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Detail Tabs */}
            <div className="flex items-center border-b border-slate-200 px-6 bg-[#F8F4EC]/60">
              <button
                onClick={() => setActiveDetailTab('dockerfile')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeDetailTab === 'dockerfile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Dockerfile Configuration
              </button>
              <button
                onClick={() => setActiveDetailTab('env')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeDetailTab === 'env'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Environment Variables ({inspectProject.envVars.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans text-sm">
              {activeDetailTab === 'dockerfile' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      Dockerfile Multi-Stage Build Spec
                    </span>
                    <button
                      onClick={() => handleCopyDockerfile(inspectProject.dockerfile)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Spec'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                    {inspectProject.dockerfile}
                  </pre>
                </div>
              )}

              {activeDetailTab === 'env' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Configured Environment Keys</span>
                    <button
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="flex items-center gap-1.5 text-xs text-blue-600 font-bold cursor-pointer"
                    >
                      {showSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showSecrets ? 'Hide Secrets' : 'Show Secrets'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {inspectProject.envVars.map((e) => (
                      <div key={e.id} className="p-3 bg-[#F8F4EC] rounded-xl border border-[#E5E7EB] flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-slate-900">{e.key}</span>
                        <span className="text-slate-600">
                          {e.isSecret && !showSecrets ? '••••••••••••••••' : e.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F8F4EC] border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onTriggerPipelineForProject(inspectProject);
                  setInspectProject(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Validation Pipeline Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
