import React, { useState } from 'react';
import { useUser } from '../../lib/auth';
import { api } from '../../lib/api';
import { Briefcase, FolderCheck, Server, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const SponsorIntel: React.FC = () => {
  const { role, user } = useUser();
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/sponsor/status');
      setApiStatus(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Briefcase className="w-48 h-48 text-cyan-400" />
        </div>

        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            Person 4 (Side B)
          </span>
          <span className="text-xs font-mono text-slate-400">Branch: feat/sponsor-intel</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Coming Soon — Sponsor ROI Dashboard & AI Talent Scout (Sponsor)
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed mb-6">
          Vertical module for Sponsor Analytics, SDK/API Adoption Tracker, Real-time Tech Stack Filter, Shortlist Candidate Export, and AI Hacker Talent Scouting.
        </p>

        {/* Isolation Boundaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
              <FolderCheck className="w-4 h-4 text-cyan-400" />
              <span>Owned Frontend</span>
            </div>
            <code className="text-xs text-cyan-300 font-mono break-all">
              frontend/src/features/sponsor-intel/
            </code>
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Owned Backend</span>
            </div>
            <code className="text-xs text-emerald-300 font-mono break-all">
              backend/features/sponsor_intel/
            </code>
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>API Prefix</span>
            </div>
            <code className="text-xs text-amber-300 font-mono">
              /api/sponsor
            </code>
          </div>
        </div>

        {/* Live Context & Backend Health */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            Active User: <span className="text-white font-semibold">{user.name}</span> (<span className="text-cyan-400 uppercase">{role}</span>)
          </div>

          <button
            onClick={checkStatus}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shadow-md flex items-center space-x-2"
          >
            {loading ? <span>Connecting...</span> : <span>Test Backend Connection</span>}
          </button>
        </div>

        {/* Status result */}
        {apiStatus && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Backend Responded OK</span>
            </div>
            <pre className="text-[11px] text-slate-400 overflow-x-auto">
              {JSON.stringify(apiStatus, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorIntel;

