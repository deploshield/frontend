import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError('');
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email });
      setStep('reset');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-soft p-6 space-y-5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="https://res.cloudinary.com/dso1dpawx/image/upload/v1783404868/logo-bg_poxwj4.png"
                alt="DeployShield"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-extrabold text-slate-900">
                Deploy<span className="text-blue-600">Shield</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {step === 'email' ? 'Reset your password' : 'Enter your new password'}
            </p>
          </div>
          {step === 'email' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}

              <p className="text-sm text-slate-600">
                Enter your email address and we'll send you a code to reset your password.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Reset Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}

              <p className="text-sm text-slate-600">
                We sent a code to <span className="font-bold">{email}</span>
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full px-3 py-2.5 text-sm text-center tracking-[0.3em] font-mono bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
              <ArrowLeft className="w-3 h-3" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
