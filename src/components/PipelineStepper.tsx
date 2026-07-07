import React from 'react';
import { Check, FileCode2, HardDrive, CheckCircle2, Globe, Award } from 'lucide-react';

export type PipelineStepId = 1 | 2 | 3 | 4 | 5;

interface PipelineStepperProps {
  currentStep: PipelineStepId;
  completedSteps: PipelineStepId[];
  onSelectStep: (step: PipelineStepId) => void;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
}) => {
  const steps = [
    { id: 1 as PipelineStepId, label: 'Validate', subtitle: 'Config & Code', icon: FileCode2 },
    { id: 2 as PipelineStepId, label: 'Build', subtitle: 'Docker Image', icon: HardDrive },
    { id: 3 as PipelineStepId, label: 'Deploy', subtitle: 'Target Servers', icon: CheckCircle2 },
    { id: 4 as PipelineStepId, label: 'Domain', subtitle: 'SSL & DNS', icon: Globe },
    { id: 5 as PipelineStepId, label: 'Completed', subtitle: 'Live Release', icon: Award },
  ];

  return (
    <div className="bg-white card-18 p-4 sm:p-6 border border-[#E5E7EB] shadow-soft mb-6 transition-all animate-fade-in">
      <div className="relative flex items-center justify-between">
        
        {/* Background Connector Bar */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#F8F4EC] -z-0 hidden sm:block" />
        
        {/* Dynamic Progress Bar overlay */}
        <div 
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-in-out -z-0 hidden sm:block"
          style={{
            width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100))}%`
          }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className="relative z-10 flex flex-col items-center group focus:outline-none cursor-pointer"
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  isCompleted
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : isCurrent
                    ? 'bg-blue-gradient text-white shadow-lg shadow-blue-600/40 ring-4 ring-blue-100 animate-step-glow'
                    : 'bg-[#F8F4EC] text-slate-400 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}

                {/* Step badge number on top corner */}
                <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-extrabold rounded-full border-2 border-white ${
                  isCompleted || isCurrent 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-slate-300 text-slate-700'
                }`}>
                  {step.id}
                </span>
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-2.5 text-center">
                <p className={`text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-slate-900'
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[11px] font-medium text-slate-400 hidden md:block">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
