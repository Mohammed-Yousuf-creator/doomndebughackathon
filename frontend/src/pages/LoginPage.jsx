import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, googleLogin, githubLogin, isAuthenticated, role, user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Role: 'participant' or 'organiser'
  const [selectedRole, setSelectedRole] = useState('participant');
  
  // Auth Mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OAuth & Helper Modals
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Social Auth Details
  const [oauthEmail, setOauthEmail] = useState('vernekarrohan38@gmail.com');
  const [oauthName, setOauthName] = useState('Rohan Vernekar');
  const [githubUsername, setGithubUsername] = useState('rohanvernekar');

  // Sync selectedRole with user role if authenticated
  useEffect(() => {
    if (role && (role === 'organiser' || role === 'organizer')) {
      setSelectedRole('organiser');
    }
  }, [role]);

  // Handle Role Change
  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setError('');
    setSuccessMsg('');
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your full name to create an account.');
      return;
    }

    if (authMode === 'signup') {
      const res = await register(email.trim(), password, name.trim(), selectedRole);
      if (res.success) {
        if (selectedRole === 'participant') {
          navigate('/participant/onboarding', { replace: true });
        } else {
          navigate('/organiser/dashboard', { replace: true });
        }
      } else {
        setError(res.error || 'Registration failed. Please check your details.');
      }
    } else {
      const res = await login(email.trim(), password, selectedRole);
      if (res.success) {
        if (selectedRole === 'participant') {
          if (!res.user.onboarding_completed) {
            navigate('/participant/onboarding', { replace: true });
          } else {
            navigate('/participant/dashboard', { replace: true });
          }
        } else {
          navigate('/organiser/dashboard', { replace: true });
        }
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    }
  };

  // Handle Google Auth Modal Submit
  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    setIsGoogleModalOpen(false);
    setError('');

    const res = await googleLogin(
      oauthEmail.trim() || 'vernekarrohan38@gmail.com',
      oauthName.trim() || 'Rohan Vernekar',
      selectedRole,
      'google-user-991',
      null
    );

    if (res.success) {
      if (selectedRole === 'participant') {
        if (!res.user.onboarding_completed) {
          navigate('/participant/onboarding', { replace: true });
        } else {
          navigate('/participant/dashboard', { replace: true });
        }
      } else {
        navigate('/organiser/dashboard', { replace: true });
      }
    } else {
      setError(res.error || 'Google authentication failed.');
    }
  };

  // Handle GitHub Auth Modal Submit
  const handleGithubSubmit = async (e) => {
    e.preventDefault();
    setIsGithubModalOpen(false);
    setError('');

    const res = await githubLogin(
      oauthEmail.trim() || 'vernekarrohan38@gmail.com',
      oauthName.trim() || 'Rohan Vernekar',
      selectedRole,
      githubUsername.trim() || 'rohanvernekar',
      null
    );

    if (res.success) {
      if (selectedRole === 'participant') {
        if (!res.user.onboarding_completed) {
          navigate('/participant/onboarding', { replace: true });
        } else {
          navigate('/participant/dashboard', { replace: true });
        }
      } else {
        navigate('/organiser/dashboard', { replace: true });
      }
    } else {
      setError(res.error || 'GitHub authentication failed.');
    }
  };

  // Handle Password Reset
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotPasswordOpen(false);
      setSuccessMsg('Password reset instructions sent to your email.');
    }, 1800);
  };

  const isParticipant = selectedRole === 'participant';

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1916] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Top Header with Aegis Typography Branding */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#E7DFD5]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-2xl tracking-tight text-[#1F1916]">aegis</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#2F5B3C]"></span>
          <span className="text-xs font-mono text-[#73645A] border-l border-[#DDD2C5] pl-3 hidden sm:inline">
            Security & Role Gateway
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#73645A]">
          <span className="h-2 w-2 rounded-full bg-[#2F5B3C] animate-pulse"></span>
          <span>Access Control Active &bull; SQLite Protected</span>
        </div>
      </header>

      {/* Main Dual-Portal & Authentication Section */}
      <main className="my-auto py-8 max-w-4xl mx-auto w-full flex flex-col items-center">
        {/* Editorial Intro Banner */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#2F5B3C] bg-[#EFF5F1] px-3.5 py-1 rounded-md border border-[#DEEBE1] font-semibold">
            <span className="material-symbols-outlined text-sm">shield</span>
            Role-Based Authentication
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1F1916] mt-3">
            Select your portal to continue
          </h1>
          <p className="text-xs sm:text-sm text-[#73645A] mt-2 leading-relaxed">
            Students and event organisers operate in two completely isolated interfaces with strict access controls.
          </p>
        </div>

        {/* Two Visual Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
          {/* Participant Tab Card */}
          <button
            type="button"
            onClick={() => handleRoleChange('participant')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
              isParticipant
                ? 'bg-white border-[#2F5B3C] shadow-md ring-2 ring-[#2F5B3C]/10'
                : 'bg-[#FAF7F2] border-[#E7DFD5] hover:border-[#D5C9BD] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isParticipant ? 'bg-[#EFF5F1] text-[#2F5B3C]' : 'bg-[#EFE8DF] text-[#73645A]'
              }`}>
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              {isParticipant && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#2F5B3C] ring-4 ring-[#EFF5F1]"></span>
              )}
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F1916]">Student / Participant</h3>
            <p className="text-xs text-[#73645A] mt-1 leading-relaxed">
              Discover hackathons, find mentors, join as a solo builder, and showcase projects.
            </p>
          </button>

          {/* Organiser Tab Card */}
          <button
            type="button"
            onClick={() => handleRoleChange('organiser')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
              !isParticipant
                ? 'bg-white border-[#943C1D] shadow-md ring-2 ring-[#943C1D]/10'
                : 'bg-[#FAF7F2] border-[#E7DFD5] hover:border-[#D5C9BD] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                !isParticipant ? 'bg-[#FBEFEA] text-[#943C1D]' : 'bg-[#EFE8DF] text-[#73645A]'
              }`}>
                <span className="material-symbols-outlined text-xl">badge</span>
              </div>
              {!isParticipant && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#943C1D] ring-4 ring-[#FBEFEA]"></span>
              )}
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F1916]">Organiser / Host</h3>
            <p className="text-xs text-[#73645A] mt-1 leading-relaxed">
              Manage registrations, review submissions, coordinate tracks, and distribute prizes.
            </p>
          </button>
        </div>

        {/* AUTH CARD (Structure matching reference, themed in Aegis Warm Stone & Editorial Typography) */}
        <div className="bg-white rounded-3xl border border-[#E7DFD5] shadow-card p-8 sm:p-10 w-full max-w-md transition-all">
          {/* Active Session Notice Banner if user already has an active session */}
          {isAuthenticated && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#73645A]">Active Session</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  role === 'organiser' ? 'bg-[#FBEFEA] text-[#943C1D]' : 'bg-[#EFF5F1] text-[#2F5B3C]'
                }`}>
                  {role === 'organiser' ? 'Organiser' : 'Participant'}
                </span>
              </div>
              <p className="text-xs text-[#1F1916]">
                Signed in as <strong className="font-semibold">{user?.name || user?.email}</strong>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(role === 'organiser' ? '/organiser/dashboard' : '/participant/dashboard')}
                  className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg text-white transition-colors cursor-pointer text-center ${
                    role === 'organiser' ? 'bg-[#943C1D] hover:bg-[#7D3218]' : 'bg-[#24422D] hover:bg-[#1A3322]'
                  }`}
                >
                  Go to {role === 'organiser' ? 'Organiser' : 'Participant'} Portal &rarr;
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-medium py-2 px-3 rounded-lg border border-[#D5C9BD] bg-white text-[#73645A] hover:text-[#943C1D] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-3xl font-semibold text-[#1F1916] tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs text-[#73645A] mt-1.5 leading-relaxed">
              {authMode === 'login'
                ? `Sign in to access your Aegis ${isParticipant ? 'participant hub' : 'command center'}`
                : `Sign up to join Aegis as ${isParticipant ? 'an individual builder' : 'an event organiser'}`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C7C1] text-xs text-[#943C1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-[#EFF5F1] border border-[#DEEBE1] text-xs text-[#2F5B3C] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Login Row: Google & GitHub in Warm Stone aesthetic */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] rounded-xl text-xs font-semibold text-[#1F1916] transition-all shadow-2xs hover:border-[#D5C9BD] cursor-pointer"
            >
              {/* Google SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] rounded-xl text-xs font-semibold text-[#1F1916] transition-all shadow-2xs hover:border-[#D5C9BD] cursor-pointer"
            >
              {/* GitHub SVG Logo */}
              <svg className="w-4 h-4 fill-current text-[#1F1916]" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* OR Divider with subtle line */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#E7DFD5] w-full"></div>
            <span className="bg-white px-3 text-[10px] font-mono font-bold text-[#A89C92] uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name for Sign Up */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rohan Vernekar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl placeholder-[#A89C92] text-[#1F1916] focus:bg-white focus:outline-none focus:border-[#24422D] transition-all"
                />
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl placeholder-[#A89C92] text-[#1F1916] focus:bg-white focus:outline-none focus:border-[#24422D] transition-all"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1916] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 pr-10 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl placeholder-[#A89C92] text-[#1F1916] focus:bg-white focus:outline-none focus:border-[#24422D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#73645A] hover:text-[#1F1916] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Action Button (Forest Green for Participant, Terracotta for Organiser) */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                isParticipant
                  ? 'bg-[#24422D] hover:bg-[#1A3322]'
                  : 'bg-[#943C1D] hover:bg-[#7D3218]'
              } disabled:opacity-60`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </>
              ) : authMode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              ) : (
                <>
                  <span>Create {isParticipant ? 'Participant' : 'Organiser'} Account</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Links (Forgot Password? & Sign Up toggle) */}
          <div className="flex items-center justify-between text-xs text-[#73645A] pt-5 mt-3 border-t border-[#F0EAE1]">
            {authMode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[#943C1D] hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
                <div>
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setError(''); }}
                    className="text-[#24422D] hover:underline font-semibold cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full text-center">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className="text-[#24422D] hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Accounts Helper */}
          <div className="pt-4 mt-4 border-t border-[#F0EAE1]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#73645A] mb-2 flex items-center justify-between">
              <span>Quick Demo Accounts</span>
              <span className="text-[#A89C92]">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('organiser');
                  setEmail('aris.vane@aegis.io');
                  setPassword('password123');
                  setError('');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  !isParticipant
                    ? 'bg-[#FBEFEA] border-[#943C1D]/40 text-[#943C1D] font-semibold'
                    : 'bg-[#FAF7F2] border-[#E7DFD5] text-[#73645A] hover:border-[#D5C9BD]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">shield_person</span>
                  <span>Organiser Demo</span>
                </div>
                <div className="text-[10px] opacity-75 font-mono truncate">aris.vane@aegis.io</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('participant');
                  setEmail('marcus.chen@student.mit.edu');
                  setPassword('password123');
                  setError('');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  isParticipant
                    ? 'bg-[#EFF5F1] border-[#2F5B3C]/40 text-[#2F5B3C] font-semibold'
                    : 'bg-[#FAF7F2] border-[#E7DFD5] text-[#73645A] hover:border-[#D5C9BD]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">school</span>
                  <span>Student Demo</span>
                </div>
                <div className="text-[10px] opacity-75 font-mono truncate">marcus.chen@mit...</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Aegis Isolation Notice */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#73645A] gap-2">
        <span>&copy; 2026 Aegis Innovation Network. Strict Zero-Trust Role Routing.</span>
        <div className="flex items-center gap-4 font-mono">
          <span className="text-[#2F5B3C]">Participant Route: /participant</span>
          <span>&bull;</span>
          <span className="text-[#943C1D]">Organiser Route: /organiser</span>
        </div>
      </footer>

      {/* Google Authentication Modal (Aegis Warm Stone Styled) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[#E7DFD5] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-semibold text-sm text-[#1F1916]">Continue with Google</h3>
              </div>
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <p className="text-xs text-[#73645A] leading-relaxed">
                Signing in as <strong className="text-[#1F1916]">{isParticipant ? 'Student / Participant' : 'Organiser / Host'}</strong>.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-[#1F1916] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={oauthName}
                  onChange={(e) => setOauthName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1F1916] mb-1">Google Email</label>
                <input
                  type="email"
                  required
                  value={oauthEmail}
                  onChange={(e) => setOauthEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#73645A] hover:bg-[#FAF7F2] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${
                    isParticipant ? 'bg-[#24422D] hover:bg-[#1A3322]' : 'bg-[#943C1D] hover:bg-[#7D3218]'
                  }`}
                >
                  Confirm & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Authentication Modal (Aegis Warm Stone Styled) */}
      {isGithubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[#E7DFD5] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-current text-[#1F1916]" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <h3 className="font-semibold text-sm text-[#1F1916]">Continue with GitHub</h3>
              </div>
              <button
                onClick={() => setIsGithubModalOpen(false)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleGithubSubmit} className="space-y-3">
              <p className="text-xs text-[#73645A] leading-relaxed">
                Authorize GitHub access as <strong className="text-[#1F1916]">{isParticipant ? 'Student / Participant' : 'Organiser / Host'}</strong>.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-[#1F1916] mb-1">GitHub Username</label>
                <input
                  type="text"
                  required
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1F1916] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={oauthEmail}
                  onChange={(e) => setOauthEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGithubModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#73645A] hover:bg-[#FAF7F2] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${
                    isParticipant ? 'bg-[#24422D] hover:bg-[#1A3322]' : 'bg-[#943C1D] hover:bg-[#7D3218]'
                  }`}
                >
                  Authorize & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal (Aegis Styled) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[#E7DFD5] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#943C1D]">lock_reset</span>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">Reset Password</h3>
              </div>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-[#EFF5F1] border border-[#DEEBE1] text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-[#2F5B3C]">mark_email_read</span>
                <p className="text-xs font-semibold text-[#1F1916]">Reset link dispatched</p>
                <p className="text-[11px] text-[#73645A]">
                  Check {resetEmail} for instructions to restore access.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-[#73645A] leading-relaxed">
                  Enter your registered email address and we'll send you an encrypted token to reset your password.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1F1916] mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#73645A] hover:bg-[#FAF7F2] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#943C1D] hover:bg-[#7D3218] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
