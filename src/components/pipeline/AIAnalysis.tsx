import { Sparkles, AlertTriangle } from 'lucide-react';

interface Issue {
  message: string;
  severity: string;
  fix?: string;
}

interface AIAnalysisData {
  summary: string;
  details?: string;
  fix_suggestion?: string;
  issues?: Issue[];
}

interface AIAnalysisProps {
  analysis: AIAnalysisData;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-bold text-purple-800">AI Analysis</span>
      </div>

      <p className="text-xs text-purple-900 font-medium">{analysis.summary}</p>

      {analysis.details && (
        <p className="text-[11px] text-purple-700">{analysis.details}</p>
      )}

      {analysis.fix_suggestion && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800">{analysis.fix_suggestion}</p>
        </div>
      )}

      {analysis.issues && analysis.issues.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-purple-200">
          {analysis.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)} shrink-0 mt-1`} />
              <div>
                <p className="text-[11px] text-purple-900">{issue.message}</p>
                {issue.fix && <p className="text-[10px] text-purple-600 mt-0.5">{issue.fix}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
