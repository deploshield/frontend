import React, { useState } from 'react';
import { Globe, Lock, Copy, Check, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { DNSRecord } from '../types';

interface StepDomainProps {
  dnsRecords: DNSRecord[];
  onDomainVerified: () => void;
}

export const StepDomain: React.FC<StepDomainProps> = ({ dnsRecords, onDomainVerified }) => {
  const [domainInput, setDomainInput] = useState('api-gateway.acme.com');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(true);
  const [httpsEnabled, setHttpsEnabled] = useState(true);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleVerifyDomain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Domain Input & SSL Card */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Connect Custom Domain
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure DNS records and automatic Let's Encrypt TLS/SSL wildcard certificate.
            </p>
          </div>

          <button
            onClick={onDomainVerified}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all shrink-0"
          >
            <span>Complete Deployment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Domain Input Field */}
          <div className="md:col-span-8 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Target Domain Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="e.g. app.yourcompany.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={handleVerifyDomain}
                disabled={isVerifying}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Checking DNS...' : 'Verify DNS'}</span>
              </button>
            </div>

            {verificationSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>DNS Propagation verified! Domain is active and routing traffic to current ingress controller.</span>
              </div>
            )}
          </div>

          {/* SSL Status Box */}
          <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                SSL Certificate
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" />
                <span>HTTPS Enabled</span>
              </div>
            </div>

            <div className="my-3">
              <p className="text-xs font-medium text-slate-700">
                Let's Encrypt RSA 2048-bit
              </p>
              <p className="text-[11px] text-slate-500">
                Auto-renews in 88 days
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className="text-xs text-slate-600 font-medium">Force TLS 1.3</span>
              <button
                type="button"
                onClick={() => setHttpsEnabled(!httpsEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  httpsEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    httpsEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Records Table Card */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Required DNS Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Host / Name</th>
                <th className="py-3 px-3">Value / Target</th>
                <th className="py-3 px-3">TTL</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {dnsRecords.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      {record.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-900 font-semibold">
                    {record.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[240px] sm:max-w-xs">{record.value}</span>
                      <button
                        onClick={() => handleCopy(record.value)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Copy value"
                      >
                        {copiedValue === record.value ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{record.ttl}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
