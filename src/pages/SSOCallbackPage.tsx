import { useEffect } from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

export function SSOCallbackPage() {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-600 font-medium">Completing sign in...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
