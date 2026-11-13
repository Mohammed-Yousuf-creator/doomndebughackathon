import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active portal tab: 'participant' or 'organiser'
  const [selectedRole, setSelectedRole] = useState('participant');
  const [email, setEmail] = useState('marcus.chen@student.mit.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  // If already logged in, redirect to appropriate portal
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'participant') {
        navigate('/participant/dashboard', { replace: true });
      } else if (role === 'organiser') {
        navigate('/organiser/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  // Update default demo credentials when switching tabs
  const handleRoleTabChange = (newRole) => {
    setSelectedRole(newRole);
    setError('');
    if (newRole === 'participant') {
      setEmail('marcus.chen@student.mit.edu');
      setPassword('password123');
    } else {
      setEmail('aris.vane@eventforge.ai');
      setPassword('password123');
    }
  };

  const handleQuickFill = (demoEmail, demoRole) => {
    setSelectedRole(demoRole);
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const res = await login(email, password, selectedRole);
    if (res.success) {
      if (res.user.role_type === 'participant') {
        navigate('/participant/dashboard', { replace: true });
      } else {
        navigate('/organiser/dashboard', { replace: true });
      }
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1916] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Top Brand Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#E7DFD5]">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#24422D] flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
            EF
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-base tracking-tight text-[#1F1916]">
              EventForge <span className="font-serif italic font-normal text-xs text-[#73645A]">AI</span>
            </span>
            <span className="text-[10px] font-mono text-[#73645A]">
              Security & Role Gateway
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#73645A]">
          <span className="h-2 w-2 rounded-full bg-[#2F5B3C] animate-pulse"></span>
          <span>Access Control Active • AES-256 Auth</span>
        </div>
      </div>

      {/* Main Dual-Portal Section */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#2F5B3C] bg-[#EFF5F1] px-3 py-1 rounded-full border border-[#DEEBE1] font-semibold">
            Role-Based Authentication
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1F1916] mt-3">
            Select your portal to continue
          </h1>
          <p className="text-xs sm:text-sm text-[#73645A] mt-2 leading-relaxed">
            Students and event organizers operate in two completely isolated interfaces with strict access controls.
          </p>
        </div>

        {/* Portal Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {/* Participant Tab Card */}
          <button
            type="button"
            onClick={() => handleRoleTabChange('participant')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
              selectedRole === 'participant'
                ? 'bg-white border-[#2F5B3C] shadow-md ring-2 ring-[#2F5B3C]/10'
                : 'bg-[#FAF7F2] border-[#E7DFD5] hover:border-[#D5C9BD] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-[#2F5B3C]">
                school
              </span>
              {selectedRole === 'participant' && (
                <span className="h-2 w-2 rounded-full bg-[#2F5B3C]"></span>
              )}
            </div>
            <h3 className="font-semibold text-sm text-[#1F1916]">
              Student / Participant Login
            </h3>
            <p className="text-[11px] text-[#73645A] mt-1 leading-snug">
              For hackers, students & teams to build, collaborate in War Rooms, and submit projects.
            </p>
          </button>

          {/* Organiser Tab Card */}
          <button
            type="button"
            onClick={() => handleRoleTabChange('organiser')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
              selectedRole === 'organiser'
                ? 'bg-white border-[#943C1D] shadow-md ring-2 ring-[#943C1D]/10'
                : 'bg-[#FAF7F2] border-[#E7DFD5] hover:border-[#D5C9BD] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-[#943C1D]">
                admin_panel_settings
              </span>
              {selectedRole === 'organiser' && (
                <span className="h-2 w-2 rounded-full bg-[#943C1D]"></span>
              )}
            </div>
            <h3 className="font-semibold text-sm text-[#1F1916]">
              Organiser / Sponsor Login
            </h3>
            <p className="text-[11px] text-[#73645A] mt-1 leading-snug">
              For directors, judges & sponsors to manage check-ins, score rubrics, and track ROI.
            </p>
          </button>
        </div>

        {/* Login Form Box */}
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E7DFD5] shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F0EAE1]">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-lg ${selectedRole === 'participant' ? 'text-[#2F5B3C]' : 'text-[#943C1D]'}`}>
                {selectedRole === 'participant' ? 'badge' : 'shield_person'}
              </span>
              <span className="font-semibold text-xs text-[#1F1916] uppercase font-mono tracking-wider">
                {selectedRole === 'participant' ? 'Participant Gateway' : 'Organiser & Sponsor Gateway'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#73645A]">
              SSL Protected
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C7C1] text-xs text-[#943C1D] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu or name@eventforge.ai"
                className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1F1916] placeholder-[#A89C92] focus:outline-none focus:border-[#24422D] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1F1916] placeholder-[#A89C92] focus:outline-none focus:border-[#24422D] focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded-xl text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 ${
                selectedRole === 'participant'
                  ? 'bg-[#24422D] hover:bg-[#1A3322]'
                  : 'bg-[#943C1D] hover:bg-[#7D3217]'
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {selectedRole === 'participant' ? 'Participant Hub' : 'Command Center'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Fast Fill Test Accounts */}
          <div className="mt-6 pt-5 border-t border-[#F0EAE1]">
            <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider block mb-2.5">
              1-Click Demo Profiles ({selectedRole.toUpperCase()})
            </span>

            {selectedRole === 'participant' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('marcus.chen@student.mit.edu', 'participant')}
                  className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-left hover:bg-[#F2EDE4] transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#1F1916] block">Marcus Chen</span>
                  <span className="text-[10px] text-[#73645A] block">Lead Architect • MIT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('elena.rostova@cmu.edu', 'participant')}
                  className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-left hover:bg-[#F2EDE4] transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#1F1916] block">Elena Rostova</span>
                  <span className="text-[10px] text-[#73645A] block">SLAM Specialist • CMU</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('aris.vane@eventforge.ai', 'organiser')}
                  className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-left hover:bg-[#F2EDE4] transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#1F1916] block truncate">Dr. Aris Vane</span>
                  <span className="text-[10px] text-[#73645A] block truncate">Director Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('sponsor@nvidia.com', 'organiser')}
                  className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-left hover:bg-[#F2EDE4] transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#1F1916] block truncate">Kenji Tanaka</span>
                  <span className="text-[10px] text-[#73645A] block truncate">NVIDIA Sponsor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('judge@robotics.org', 'organiser')}
                  className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-left hover:bg-[#F2EDE4] transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#1F1916] block truncate">Dr. Thome</span>
                  <span className="text-[10px] text-[#73645A] block truncate">Judge Chair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full pt-6 border-t border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#73645A] gap-2">
        <span>© 2026 EventForge AI. Strict Zero-Trust Role Routing.</span>
        <div className="flex items-center gap-4">
          <span className="text-[#2F5B3C] font-mono">Participant Route: /participant</span>
          <span>•</span>
          <span className="text-[#943C1D] font-mono">Organiser Route: /organiser</span>
        </div>
      </div>
    </div>
  );
}

