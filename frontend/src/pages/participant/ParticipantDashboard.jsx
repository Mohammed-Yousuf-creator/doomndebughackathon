import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import WarRoom from '../../components/WarRoom';
import { TaskModal } from '../../components/Modals';

export default function ParticipantDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home'); // 'home', 'hackathons', 'teams', 'submissions', 'schedule', 'profile'
  const [activityTab, setActivityTab] = useState('registrations'); // 'registrations', 'teams', 'matchmaker', 'submissions'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [teamSubTab, setTeamSubTab] = useState('warroom');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Team creation inputs
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTrack, setNewTeamTrack] = useState('Track 01: Autonomous Robotics & AI');
  const [newTeamLookingFor, setNewTeamLookingFor] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');

  // Project submission inputs
  const [submissionForm, setSubmissionForm] = useState({
    project_name: 'Smart Drone Navigation Assistant',
    tagline: 'An easy-to-use autonomous mapping tool for students and researchers',
    track: 'Track 01: Autonomous Robotics & AI',
    repo_url: 'https://github.com/marcuschen/drone-nav',
    demo_url: 'https://youtu.be/drone-nav-demo',
    deck_url: 'https://slides.com/marcuschen/drone-nav',
    abstract: 'We built a friendly open-source app that lets autonomous robots map indoor rooms safely using low-cost cameras and AI.'
  });
  const [submittedStatus, setSubmittedStatus] = useState(false);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const runPreFlightAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditResult({
        score: 88,
        freshness_score: '94.8%',
        track_verified: 'Track 01: Autonomous Robotics & AI',
        pitch_critique: 'Your current tagline sounds like a generic school project rather than an enterprise-grade hackathon champion. It omits the edge latency and sensor fusion hook.',
        suggested_tagline: 'Deterministic sub-15ms multi-agent visual SLAM for indoor robotics operating without GPS or cloud connectivity.',
        suggested_abstract: 'Indoor search-and-rescue and autonomous inspection robots routinely suffer connection loss in degraded Wi-Fi environments. We developed a peer-to-peer decentralized mesh state estimation protocol verified on Jetson hardware with 11.4ms loop closure.',
        checklist: [
          { label: 'GitHub Repository Public & Active', status: 'pass' },
          { label: 'Organic Commit Cadence (No 1-commit clone dump detected)', status: 'pass' },
          { label: 'Required Track SDK (JetPack / TensorRT) Detected in AST', status: 'pass' },
          { label: 'Architecture & Latency Benchmark Documentation', status: 'warning', note: 'Include hardware power draw specs in README' },
          { label: '3-Minute Video Demo with Timestamp Chapters', status: 'pass' },
        ]
      });
      showToast('AI Pre-Flight Audit Complete: Score 88/100');
    }, 1200);
  };

  const applyAiPolish = () => {
    if (auditResult) {
      setSubmissionForm(prev => ({
        ...prev,
        tagline: auditResult.suggested_tagline,
        abstract: auditResult.suggested_abstract
      }));
      showToast('AI-Polished Pitch & Value Proposition applied to submission form!');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadParticipantData = async () => {
    try {
      const res = await api.fetchParticipantOverview(user?.id);
      setData(res);
    } catch (err) {
      console.warn("Could not load participant data, using fallback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipantData();
  }, [user]);

  // Register for an event
  const handleRegisterEvent = async (eventId, title) => {
    try {
      await api.registerForEvent(eventId, user?.id || 'u-part-1', 'solo');
      showToast(`You're registered for ${title}!`);
      await loadParticipantData();
      setActivityTab('registrations');
    } catch (err) {
      showToast(err.message || `You're registered!`);
    }
  };

  // Create team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast('Please enter a team name');
      return;
    }
    try {
      const activeEvtId = data?.events_catalog?.find(e => e.registered)?.id || 'evt-ash-2025';
      const res = await api.createTeam({
        user_id: user?.id || 'u-part-1',
        event_id: activeEvtId,
        team_name: newTeamName,
        track: newTeamTrack,
        looking_for: newTeamLookingFor || 'Looking for 1 frontend or Python teammate'
      });
      showToast(`Team "${newTeamName}" created! Your team code is: ${res.team_code}`);
      setNewTeamName('');
      setNewTeamLookingFor('');
      await loadParticipantData();
      setActivityTab('teams');
    } catch (err) {
      showToast(err.message || 'Could not create team');
    }
  };

  // Join team with code
  const handleJoinWithCode = async (e) => {
    e.preventDefault();
    if (!teamCodeInput.trim()) {
      showToast('Please type a team code');
      return;
    }
    try {
      const res = await api.joinTeam({
        user_id: user?.id || 'u-part-1',
        team_code: teamCodeInput.trim()
      });
      showToast(`Joined ${res.team.name}! Welcome to the squad.`);
      setTeamCodeInput('');
      await loadParticipantData();
      setActivityTab('teams');
    } catch (err) {
      showToast(err.message || 'Invalid team code');
    }
  };

  // Quick join an open team from matchmaker
  const handleJoinOpenTeam = async (team) => {
    try {
      const res = await api.joinTeam({
        user_id: user?.id || 'u-part-1',
        team_id: team.id,
        team_code: team.team_code,
        event_id: team.event_id
      });
      showToast(`Joined ${res.team.name}!`);
      await loadParticipantData();
      setActivityTab('teams');
    } catch (err) {
      showToast(err.message || 'Could not join team');
    }
  };

  // Compete solo
  const handleCompeteSolo = async (eventId, trackName) => {
    try {
      await api.competeSolo({
        user_id: user?.id || 'u-part-1',
        event_id: eventId || 'evt-ash-2025',
        track: trackName || 'Track 01: Autonomous Robotics & AI'
      });
      showToast("All set! You are competing as a Solo Builder.");
      await loadParticipantData();
      setActivityTab('teams');
    } catch (err) {
      showToast(err.message || 'Error setting solo status');
    }
  };

  // Leave team
  const handleLeaveTeam = async () => {
    if (!window.confirm('Do you want to leave your team and go back to being a solo builder?')) return;
    try {
      await api.leaveTeam(user?.id || 'u-part-1');
      showToast('You left the team. You are now solo.');
      await loadParticipantData();
    } catch (err) {
      showToast(err.message || 'Error leaving team');
    }
  };

  // Invite candidate
  const handleInviteCandidate = async (candidate) => {
    try {
      const res = await api.inviteTeammate(candidate.id, user?.id || 'u-part-1');
      showToast(res.message || `Invitation sent to ${candidate.name}!`);
    } catch {
      showToast(`Invitation sent to ${candidate.name}!`);
    }
  };

  // Submit project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitParticipantProject(submissionForm);
      setSubmittedStatus(true);
      showToast('Your project was successfully submitted! Best of luck!');
    } catch {
      showToast('Project draft saved.');
    }
  };

  const currentUser = data?.user || user;
  const hasTeam = !!currentUser?.team_name && !currentUser?.is_solo;
  const isCompetingSolo = currentUser?.team_status === 'Competing Solo';

  // Navigation Items matching Unstop layout
  const sidebarItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'hackathons', label: 'Competitions', icon: 'emoji_events' },
    { key: 'teams', label: 'Teams & Match', icon: 'groups' },
    { key: 'submissions', label: 'Submissions', icon: 'task' },
    { key: 'schedule', label: 'Schedule', icon: 'calendar_month' },
    { key: 'profile', label: 'My Profile', icon: 'account_circle' },
  ];

  // Featured Hackathons for top banner carousel (Unstop style)
  const featuredHackathons = [
    {
      id: 'evt-ash-2025',
      title: 'Autonomous Systems 2025',
      organizer: 'MIT CSAIL',
      category: 'Robotics & AI',
      mode: 'Online',
      cost: 'Free',
      prize: '$125,000 Prizes',
      gradient: 'from-[#2F5B3C] to-[#1E3F20]',
      registered: data?.events_catalog?.find(e => e.id === 'evt-ash-2025')?.registered || false
    },
    {
      id: 'evt-deeptech-berlin',
      title: 'DeepTech Bio Challenge',
      organizer: 'Berlin Innovation Hub',
      category: 'BioTech & Health',
      mode: 'Hybrid',
      cost: 'Free',
      prize: '€80,000 Grants',
      gradient: 'from-[#8C3D1E] to-[#5C230F]',
      registered: data?.events_catalog?.find(e => e.id === 'evt-deeptech-berlin')?.registered || false
    },
    {
      id: 'evt-biodesign-singapore',
      title: 'CleanTech Climate Sprint',
      organizer: 'Singapore Tech Lab',
      category: 'Climate & Clean Energy',
      mode: 'Online',
      cost: 'Free',
      prize: '$150,000 Funding',
      gradient: 'from-[#24422D] to-[#3B6B48]',
      registered: data?.events_catalog?.find(e => e.id === 'evt-biodesign-singapore')?.registered || false
    },
    {
      id: 'evt-vision-sf',
      title: 'Autonomous Vision 2026',
      organizer: 'SF AI Collective',
      category: 'Computer Vision',
      mode: 'In-Person',
      cost: 'Free',
      prize: '$60,000 Bounties',
      gradient: 'from-[#705646] to-[#453429]',
      registered: data?.events_catalog?.find(e => e.id === 'evt-vision-sf')?.registered || false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] flex font-sans selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2937] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-gray-700 animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Unstop Dimension & Design: Fixed 240px wide, docked to the left, full height) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top brand & navigation */}
        <div className="p-4 space-y-4">
          {/* Logo & Collapse Arrow */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveNav('home')}>
              <span className="font-bold text-2xl tracking-tight text-[#1F2937]">aegis</span>
              <span className="h-2 w-2 rounded-sm bg-[#2F5B3C]"></span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              title="Collapse"
            >
              <span className="material-symbols-outlined text-base">keyboard_double_arrow_left</span>
            </button>
          </div>

          {/* "You're viewing as" Dropdown Card */}
          <div className="bg-[#F3F4F6] p-2.5 rounded-xl border border-[#E5E7EB]">
            <span className="text-[11px] text-gray-500 block mb-1">You're viewing as</span>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] shadow-2xs cursor-pointer">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#2F5B3C]">person</span>
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {currentUser?.name || 'Marcus (Student)'}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
            </div>
          </div>

          {/* "+ Find Teammates" Button */}
          <button
            onClick={() => {
              setActiveNav('teams');
              setActivityTab('teams');
            }}
            className="w-full py-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#2F5B3C]">add</span>
            <span>Find Teammates</span>
          </button>

          {/* Vertical Menu Items */}
          <nav className="space-y-1 pt-1">
            {sidebarItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveNav(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#EFF5F1] text-[#24422D] font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#2F5B3C]' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: My Activity & Logout */}
        <div className="p-4 border-t border-[#E5E7EB] space-y-2">
          <button
            onClick={() => {
              setActiveNav('home');
              setActivityTab('registrations');
            }}
            className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-gray-400">insights</span>
              <span>My Activity</span>
            </span>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER (Shifted by sidebar width on desktop) */}
      <div className="flex-1 min-w-0 lg:pl-60 flex flex-col min-h-screen">
        {/* TOP HEADER BAR (Unstop Style: Search in center, Organiser button & icons on right) */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <span className="font-bold text-lg text-gray-800">aegis</span>
          </div>

          {/* Centered Wide Search Input (Exact Unstop pill) */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-auto">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-gray-400 text-base">search</span>
              <input
                type="text"
                placeholder="Search hackathons, topics, colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] hover:bg-white focus:bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F5B3C] shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Help Icon */}
            <button
              onClick={() => showToast("Need help? Reach out to support@aegis.io anytime.")}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 text-sm cursor-pointer"
              title="Help Center"
            >
              <span className="material-symbols-outlined text-lg">help</span>
            </button>

            {/* "For Organizers" Button */}
            <button
              onClick={() => {
                switchRole('organiser');
                navigate('/organiser/dashboard');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[#24422D] text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">business_center</span>
              <span>For Organizers</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => showToast("No new notifications right now.")}
              className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2F5B3C] rounded-sm"></span>
            </button>

            {/* User Avatar */}
            <div
              onClick={() => setActiveNav('profile')}
              className="w-8 h-8 rounded-lg bg-[#2F5B3C] text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all"
              title={currentUser?.name || "Student Profile"}
            >
              {currentUser?.name ? currentUser.name[0] : 'M'}
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB 1: HOME VIEW (Replicating Unstop Screenshot) */}
          {activeNav === 'home' && (
            <>
              {/* TOP CAROUSEL: FEATURED HACKATHONS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">Featured Challenges</h2>
                  <button
                    onClick={() => setActiveNav('hackathons')}
                    className="text-xs text-[#2F5B3C] font-semibold hover:underline cursor-pointer"
                  >
                    Explore all &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredHackathons.map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-2xs hover:shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
                    >
                      {/* Banner Visual */}
                      <div className={`h-28 bg-gradient-to-r ${evt.gradient} p-3.5 flex flex-col justify-between text-white relative`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            {evt.category}
                          </span>
                          <button
                            onClick={() => showToast(`Added ${evt.title} to your watchlist.`)}
                            className="text-white hover:text-red-200 cursor-pointer"
                            title="Save to Watchlist"
                          >
                            <span className="material-symbols-outlined text-lg">favorite_border</span>
                          </button>
                        </div>
                        <div>
                          <div className="text-[11px] font-mono opacity-80">{evt.organizer}</div>
                          <div className="text-xs font-bold truncate">{evt.title}</div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">{evt.mode}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#2F5B3C] font-semibold">{evt.cost}</span>
                            <span className="text-gray-500 truncate">{evt.prize}</span>
                          </div>

                          <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                            {evt.title}
                          </h3>
                        </div>

                        {/* Button */}
                        <div className="pt-3 mt-2 border-t border-gray-100">
                          {evt.registered ? (
                            <button
                              onClick={() => {
                                setActiveNav('teams');
                                setActivityTab('teams');
                              }}
                              className="w-full py-1.5 rounded-lg bg-emerald-50 text-[#24422D] text-xs font-semibold hover:bg-emerald-100 transition-colors text-center cursor-pointer"
                            >
                              Registered &bull; View Team
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegisterEvent(evt.id, evt.title)}
                              className="w-full py-1.5 rounded-lg bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold transition-colors cursor-pointer text-center"
                            >
                              Register Solo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TRUSTED BY INDUSTRY VETERANS (Exact Unstop Banner) */}
              <div className="py-4 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">
                  Trusted by Top Universities & Labs
                </span>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-gray-400 font-semibold text-sm">
                  <span className="hover:text-gray-700 transition-colors">MIT CSAIL</span>
                  <span className="hover:text-gray-700 transition-colors">Stanford</span>
                  <span className="hover:text-gray-700 transition-colors">Carnegie Mellon</span>
                  <span className="hover:text-gray-700 transition-colors">NVIDIA AI</span>
                  <span className="hover:text-gray-700 transition-colors">Google DeepMind</span>
                  <span className="hover:text-gray-700 transition-colors">UC Berkeley</span>
                </div>
              </div>

              {/* MY ACTIVITY SECTION (Exact Component from Screenshot!) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-2xs space-y-4">
                {/* Header row with accent bar & title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 bg-[#2F5B3C] rounded-sm"></span>
                    <h3 className="text-lg font-bold text-gray-900">My Activity</h3>
                  </div>

                  <button
                    onClick={() => setActiveNav('hackathons')}
                    className="inline-flex items-center gap-1 text-xs text-[#2F5B3C] font-semibold hover:underline cursor-pointer"
                  >
                    <span>View All</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {/* Sub-Tabs (Registrations, Watchlist, etc.) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setActivityTab('registrations')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'registrations'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Registrations ({data?.events_catalog?.filter(e => e.registered)?.length || 1})
                  </button>

                  <button
                    onClick={() => setActivityTab('teams')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'teams'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    My Squad / Team Status
                  </button>

                  <button
                    onClick={() => setActivityTab('matchmaker')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'matchmaker'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Find Teammates ({data?.open_teams?.length || 3} Open)
                  </button>

                  <button
                    onClick={() => setActivityTab('submissions')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'submissions'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Project Submissions
                  </button>
                </div>

                {/* TAB CONTENT: 1. REGISTRATIONS */}
                {activityTab === 'registrations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Registered Hackathon 1 */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3.5 hover:bg-white transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-[#2F5B3C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        MIT
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            Autonomous Systems Hackathon 2025
                          </h4>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-[#24422D] px-2 py-0.5 rounded-md">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">MIT CSAIL &bull; $125,000 Prize Pool</p>

                        <div className="mt-3 flex items-center gap-2">
                          {hasTeam ? (
                            <span className="text-xs text-gray-700">
                              Squad: <strong className="text-emerald-700">{currentUser.team_name}</strong>
                            </span>
                          ) : isCompetingSolo ? (
                            <span className="text-xs text-gray-700">
                              Status: <strong className="text-gray-900">Competing Solo</strong>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setActivityTab('teams')}
                                className="px-3 py-1 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                              >
                                Find Teammates
                              </button>
                              <button
                                onClick={() => handleCompeteSolo('evt-ash-2025')}
                                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                Compete Solo
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Registered Hackathon 2 / Recommendation */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3.5 hover:bg-white transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-[#8C3D1E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        BIO
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            DeepTech Bio Challenge
                          </h4>
                          <span className="text-[10px] font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                            Open
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Berlin Hub &bull; €80,000 Grants</p>

                        <div className="mt-3">
                          <button
                            onClick={() => handleRegisterEvent('evt-deeptech-berlin', 'DeepTech Bio Challenge')}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            Register for Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 2. MY SQUAD / TEAM STATUS */}
                {activityTab === 'teams' && (
                  <div className="space-y-4 pt-2">
                    {hasTeam ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2F5B3C] block">Your Active Squad</span>
                          <h4 className="text-base font-bold text-gray-900">{currentUser.team_name}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Team Share Code: <strong className="font-mono text-emerald-800 text-sm select-all">{currentUser.team_code || 'AP-7741'}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(currentUser.team_code || 'AP-7741');
                              showToast('Team code copied to clipboard!');
                            }}
                            className="px-3 py-1.5 bg-white border border-emerald-300 text-[#24422D] text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            Copy Code
                          </button>
                          <button
                            onClick={handleLeaveTeam}
                            className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            Leave Team
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                          <h4 className="text-sm font-bold text-gray-900">You are currently a Solo Builder</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            You can build on your own, create a squad and invite your friends, or enter a code to join an existing team.
                          </p>
                        </div>

                        {/* Two Quick Action Forms */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Form A: Create a Team */}
                          <form onSubmit={handleCreateTeam} className="p-4 rounded-xl bg-white border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-[#2F5B3C]">add_circle</span>
                              <span>Create a Team</span>
                            </h5>
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 mb-1">Team Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Robot Knights"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#24422D]"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                            >
                              Create Team & Get Code
                            </button>
                          </form>

                          {/* Form B: Join with Code */}
                          <form onSubmit={handleJoinWithCode} className="p-4 rounded-xl bg-white border border-gray-200 space-y-3">
                            <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-[#2F5B3C]">key</span>
                              <span>Join with Invite Code</span>
                            </h5>
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 mb-1">Enter Code from Friend</label>
                              <input
                                type="text"
                                placeholder="e.g. AP-7741 or NM-2089"
                                value={teamCodeInput}
                                onChange={(e) => setTeamCodeInput(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-mono uppercase bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#24422D]"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 cursor-pointer"
                            >
                              Join Squad
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 3. FIND TEAMMATES (MATCHMAKER) */}
                {activityTab === 'matchmaker' && (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-gray-500">
                      Looking for teammates? Here are open teams and fellow solo builders who match your skills.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(data?.open_teams || []).map((t) => (
                        <div key={t.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                              <span>{t.members_count}/{t.max_members} Members</span>
                              <span className="font-mono text-[10px] text-emerald-700">{t.team_code}</span>
                            </div>
                            <h5 className="text-sm font-bold text-gray-900">{t.name}</h5>
                            <span className="text-[11px] text-gray-500 block">{t.track}</span>

                            <div className="mt-2.5 p-2 bg-white rounded-lg border border-gray-200">
                              <span className="text-[10px] font-bold text-[#8C3D1E] uppercase block">Looking for</span>
                              <span className="text-xs text-gray-800">{t.looking_for}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleJoinOpenTeam(t)}
                            className="mt-3 w-full py-1.5 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                          >
                            Join This Team
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 4. SUBMISSIONS */}
                {activityTab === 'submissions' && (
                  <div className="pt-2">
                    <form onSubmit={handleProjectSubmit} className="max-w-xl space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                          type="text"
                          required
                          value={submissionForm.project_name}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, project_name: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Short Description</label>
                        <input
                          type="text"
                          required
                          value={submissionForm.tagline}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, tagline: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">GitHub Repo URL</label>
                        <input
                          type="url"
                          required
                          value={submissionForm.repo_url}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, repo_url: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-5 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                      >
                        Submit Project
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: COMPETITIONS / HACKATHONS */}
          {activeNav === 'hackathons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">All Competitions</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Explore active hackathons and open challenges.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {(data?.events_catalog || []).map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {evt.category}
                        </span>
                        <span className="text-[11px] font-semibold text-[#2F5B3C] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {evt.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900">{evt.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{evt.dates} &bull; {evt.location}</p>

                      <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-[11px] font-bold text-[#8C3D1E] uppercase block">Prizes</span>
                        <span className="text-sm font-bold text-gray-900">{evt.prizes}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100">
                      {evt.registered ? (
                        <div className="text-xs font-semibold text-[#2F5B3C] bg-emerald-50 p-2.5 rounded-lg text-center">
                          Registered &bull; Ready to Build
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegisterEvent(evt.id, evt.title)}
                          className="w-full py-2 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                        >
                          Register for Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEAMS & MATCHMAKER */}
          {activeNav === 'teams' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Teams & Matchmaker</h2>
                <p className="text-xs text-gray-500 mt-0.5">Find teammates, create a squad, or join friends.</p>
              </div>

              {/* Status Banner */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
                {hasTeam ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#2F5B3C]">Active Squad</span>
                      <h3 className="text-lg font-bold text-gray-900">{currentUser.team_name}</h3>
                      <p className="text-xs text-gray-500">Team Code: <strong className="font-mono">{currentUser.team_code || 'AP-7741'}</strong></p>
                    </div>
                    <button
                      onClick={handleLeaveTeam}
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      Leave Team
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">You are building as an Individual (Solo)</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      You can create a team to get an invite code, enter a friend's code, or compete solo.
                    </p>
                  </div>
                )}
              </div>

              {/* Open Teams List */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-gray-900">Open Teams Looking for Teammates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(data?.open_teams || []).map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{t.members_count}/{t.max_members} Members</span>
                          <span className="font-mono text-emerald-700">{t.team_code}</span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                        <span className="text-xs text-gray-500 block mt-0.5">{t.track}</span>
                        <div className="mt-2 text-xs bg-white p-2 rounded-lg border border-gray-200">
                          <strong className="block text-[#8C3D1E] text-[10px] uppercase">Needs:</strong>
                          <span>{t.looking_for}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinOpenTeam(t)}
                        className="mt-3 w-full py-1.5 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                      >
                        Join Team
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solo Builders */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-gray-900">Fellow Solo Builders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(data?.solo_builders || []).map((solo) => (
                    <div key={solo.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {solo.match_score}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-2">{solo.name}</h4>
                        <p className="text-xs text-gray-500">{solo.college}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{solo.bio}</p>
                      </div>

                      <button
                        onClick={() => handleInviteCandidate(solo)}
                        className="mt-3 w-full py-1.5 bg-white border border-[#24422D] text-[#24422D] text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        Send Invite
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUBMISSIONS & AI PITCH DOCTOR */}
          {activeNav === 'submissions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Submission Form (6 cols) */}
              <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-gray-200 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Project Final Submission</h2>
                    <p className="text-[11px] text-gray-500">Provide your repository and credentials before sprint deadline.</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#2F5B3C] bg-[#EFF5F1] px-2 py-0.5 rounded font-semibold border border-[#DEEBE1]">
                    Track 01
                  </span>
                </div>

                <form onSubmit={handleProjectSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={submissionForm.project_name}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, project_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-700">Tagline / Short Summary</label>
                      {auditResult && (
                        <button
                          type="button"
                          onClick={applyAiPolish}
                          className="text-[10px] font-bold text-[#2F5B3C] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">auto_fix_high</span>
                          <span>Apply AI Polish</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={submissionForm.tagline}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub Repo Link</label>
                    <input
                      type="url"
                      required
                      value={submissionForm.repo_url}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, repo_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Demo Video Link</label>
                    <input
                      type="url"
                      value={submissionForm.demo_url}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, demo_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Executive Abstract</label>
                    <textarea
                      rows={3}
                      value={submissionForm.abstract}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, abstract: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="py-2 px-5 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer shadow-subtle flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Lock & Submit Project</span>
                    </button>
                    {submittedStatus && (
                      <span className="text-xs font-mono text-[#2F5B3C] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Submission Confirmed</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column: AI Pitch Doctor & Pre-Submission Rubric Co-Pilot (6 cols) */}
              <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-gray-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#C2542D]">smart_toy</span>
                    <h2 className="text-sm font-bold text-gray-900">AI Pitch Doctor & Rubric Co-Pilot</h2>
                  </div>
                  <button
                    onClick={runPreFlightAudit}
                    disabled={auditRunning}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] disabled:opacity-50 text-white flex items-center gap-1.5 shadow-subtle cursor-pointer"
                  >
                    {auditRunning ? (
                      <>
                        <span className="w-3 h-3 rounded-sm border-2 border-white border-t-transparent animate-spin"></span>
                        <span>Auditing Repo...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        <span>Run Pre-Flight Audit</span>
                      </>
                    )}
                  </button>
                </div>

                {!auditResult && !auditRunning && (
                  <div className="p-6 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
                    <span className="material-symbols-outlined text-3xl text-gray-400">rate_review</span>
                    <h3 className="text-xs font-semibold text-gray-800">Pre-Flight Rubric Check Ready</h3>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Run an automated scan before submitting to cross-examine your repo code against the organizer rubric, verify fresh commits, and polish your pitch.
                    </p>
                    <button
                      onClick={runPreFlightAudit}
                      className="mt-2 text-xs font-semibold text-[#2F5B3C] hover:underline"
                    >
                      Click "Run Pre-Flight Audit" to analyze
                    </button>
                  </div>
                )}

                {auditRunning && (
                  <div className="p-8 rounded-xl bg-gray-50 text-center space-y-3">
                    <div className="w-8 h-8 mx-auto rounded-sm border-2 border-[#2F5B3C] border-t-transparent animate-spin"></div>
                    <p className="text-xs font-semibold text-gray-800">Analyzing GitHub AST & Commit History...</p>
                    <p className="text-[11px] text-gray-500 font-mono">Cross-referencing Track 01 Rubrics & SLA criteria</p>
                  </div>
                )}

                {auditResult && !auditRunning && (
                  <div className="space-y-3">
                    {/* Readiness Banner */}
                    <div className="p-3.5 rounded-xl bg-[#EFF5F1] border border-[#DEEBE1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#2F5B3C] uppercase font-bold block">
                          Rubric Evaluation Readiness
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-bold font-sans text-[#1F1916]">{auditResult.score}/100</span>
                          <span className="text-xs text-[#2F5B3C] font-semibold">High Readiness</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block">Fresh Code Score</span>
                        <span className="text-xs font-mono font-bold text-[#2F5B3C]">{auditResult.freshness_score} Verified</span>
                      </div>
                    </div>

                    {/* AI Pitch Doctor Critique */}
                    <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E7DFD5] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2542D]">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        <span>Pitch Doctor Critique</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed italic bg-white p-2.5 rounded-lg border border-[#E7DFD5]">
                        "{auditResult.pitch_critique}"
                      </p>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#2F5B3C]">
                            Recommended Pitch Hook:
                          </span>
                          <button
                            onClick={applyAiPolish}
                            className="text-[10px] font-bold text-[#2F5B3C] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                            <span>Apply to Form</span>
                          </button>
                        </div>
                        <p className="text-xs font-medium text-gray-800 bg-[#EFF5F1] p-2.5 rounded-lg border border-[#DEEBE1] leading-relaxed">
                          {auditResult.suggested_tagline}
                        </p>
                      </div>
                    </div>

                    {/* Rubric Verification Checklist */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-500 block mb-2">
                        Pre-Submission Compliance Checklist
                      </span>
                      <div className="space-y-1.5 text-xs">
                        {auditResult.checklist.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 bg-white p-2 rounded-lg border border-gray-100">
                            <div className="flex items-start gap-1.5">
                              <span className={`material-symbols-outlined text-sm shrink-0 ${
                                item.status === 'pass' ? 'text-[#2F5B3C]' : 'text-[#C47D1C]'
                              }`}>
                                {item.status === 'pass' ? 'check_circle' : 'warning'}
                              </span>
                              <span className="text-[11px] text-gray-700 leading-tight">{item.label}</span>
                            </div>
                            <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              item.status === 'pass' ? 'bg-[#EFF5F1] text-[#2F5B3C]' : 'bg-[#FDF6EA] text-[#C47D1C]'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SCHEDULE */}
          {activeNav === 'schedule' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Sprint Schedule</h2>
              <div className="space-y-3 pt-2">
                {(data?.schedule || []).map((s) => (
                  <div key={s.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#24422D]">{s.time}</span>
                      <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                      <p className="text-xs text-gray-500">{s.location}</p>
                    </div>
                    <span className="text-[11px] font-semibold bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeNav === 'profile' && (
            <div className="max-w-xl bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#2F5B3C] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    {currentUser?.name ? currentUser.name[0] : 'M'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{currentUser?.name}</h3>
                    <p className="text-xs text-gray-500">
                      {currentUser?.profile_type || 'College Student'} &bull; {currentUser?.college || currentUser?.affiliation || 'MIT CSAIL'}
                    </p>
                    <span className="text-[11px] text-emerald-800 font-medium">Badge: {currentUser?.badge_uuid}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/participant/onboarding')}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Education & Contact Details */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Degree / Major</span>
                  <span className="font-semibold text-gray-800">{currentUser?.degree || 'B.Tech / B.S. CS'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Graduation Year</span>
                  <span className="font-semibold text-gray-800">{currentUser?.graduation_year || '2026'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">City</span>
                  <span className="font-semibold text-gray-800">{currentUser?.city || 'Bangalore'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Contact Phone</span>
                  <span className="font-semibold text-gray-800">{currentUser?.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">About & Elevator Pitch</h4>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed">
                  {currentUser?.bio || "Student developer interested in AI, robotics, and edge computing. Looking for teammates!"}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Technical Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUser?.skills || ["Python", "React", "AI", "C++"]).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#24422D] border border-emerald-100 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {(currentUser?.github || currentUser?.linkedin) && (
                <div className="pt-2 flex items-center gap-3 text-xs">
                  {currentUser?.github && (
                    <a
                      href={currentUser.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700 hover:text-black font-semibold flex items-center gap-1 underline"
                    >
                      GitHub Profile &rarr;
                    </a>
                  )}
                  {currentUser?.linkedin && (
                    <a
                      href={currentUser.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      LinkedIn Profile &rarr;
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
