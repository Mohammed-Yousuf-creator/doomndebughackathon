import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useUser } from './lib/auth';
import { Navbar } from './components/Navbar';
import { ParticipantTeams } from './features/participant-teams';
import { ParticipantHub } from './features/participant-hub';
import { OrganizerOps } from './features/organizer-ops';
import { SponsorIntel } from './features/sponsor-intel';
import {
  Users,
  LayoutGrid,
  ShieldCheck,
  Briefcase,
  Terminal,
  ArrowRight,
  GitBranch,
  Cpu,
  Layers,
  Lock,
} from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const { role, user } = useUser();

  const tracks = [
    {
      title: 'Participant: Teams & Matching',
      owner: 'Person 1 (Side A)',
      path: '/participant/teams',
      icon: Users,
      color: 'emerald',
      branch: 'feat/participant-teams',
      desc: 'Hacker registration, dynamic team builder, skill tagger, and AI-powered matchmaking algorithm.',
    },
    {
      title: 'Participant: Live Hub & Submissions',
      owner: 'Person 2 (Side A)',
      path: '/participant/hub',
      icon: LayoutGrid,
      color: 'blue',
      branch: 'feat/participant-hub',
      desc: 'Interactive schedule timeline, real-time announcements stream, mentor requests, and GitHub submission portal.',
    },
    {
      title: 'Organizer: Ops & AI Judging',
      owner: 'Person 3 (Side B)',
      path: '/organizer',
      icon: ShieldCheck,
      color: 'purple',
      branch: 'feat/organizer-ops',
      desc: 'Event setup, 4-phase controls, AI repo analysis audit, multi-criteria judging rubrics, and live leaderboards.',
    },
    {
      title: 'Sponsor: Intelligence & Talent',
      owner: 'Person 4 (Side B)',
      path: '/sponsor',
      icon: Briefcase,
      color: 'cyan',
      branch: 'feat/sponsor-intel',
      desc: 'API/SDK adoption dashboard, multi-dimensional tech filter, candidate shortlists, and AI talent scout.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="mb-10 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>HackOS Locked Core Initialized</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            AI Hackathon & Tech Event <span className="text-emerald-400">Intelligence Platform</span>
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-3xl">
            Clean 4-module monorepo partitioned for rapid parallel development. Teammates work exclusively in their isolated vertical slices.
          </p>
        </div>

        <div className="mt-6 sm:mt-0 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left shrink-0">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Current Demo Session</div>
          <div className="text-sm font-semibold text-white">{user.name}</div>
          <div className="text-xs text-emerald-400 font-mono mt-0.5 capitalize flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Role: {role}</span>
          </div>
        </div>
      </div>

      {/* 4 Isolated Feature Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <Link
              key={track.path}
              to={track.path}
              className="group rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {track.owner}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {track.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {track.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-slate-500">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{track.branch}</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Module</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Architecture & Rules Summary */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Locked Skeleton Monorepo Guidelines</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Locked Shared Core</span>
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              <code>App.tsx</code>, <code>Navbar.tsx</code>, <code>lib/*</code>, <code>core/*</code>, and <code>main.py</code> are locked. Changes require whole-team sync.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-cyan-400 font-semibold mb-1 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Zero Schema Migrations</span>
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              Store custom feature attributes inside the <code>metadata_json</code> column on core models (<code>User</code>, <code>Event</code>, <code>Team</code>, <code>Submission</code>, <code>Score</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-amber-400 font-semibold mb-1 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Zero Auth Friction</span>
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              All backend endpoints ingest <code>X-Demo-Role</code> via <code>get_current_user</code>. Switch roles anytime using the top navbar dropdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/participant/teams/*" element={<ParticipantTeams />} />
              <Route path="/participant/hub/*" element={<ParticipantHub />} />
              <Route path="/organizer/*" element={<OrganizerOps />} />
              <Route path="/sponsor/*" element={<SponsorIntel />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

