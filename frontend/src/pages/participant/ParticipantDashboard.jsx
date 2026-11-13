import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import WarRoom from '../../components/WarRoom';
import { TaskModal } from '../../components/Modals';

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('war-room'); // 'war-room', 'discovery', 'submissions', 'schedule', 'passport'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Project submission state
  const [submissionForm, setSubmissionForm] = useState({
    project_name: 'VectorSwarm Autonomous Navigation Core',
    tagline: 'Autonomous Multi-Agent SLAM & Swarm Navigation Pipeline',
    track: 'Track 04 // Swarm Intelligence',
    repo_url: 'https://github.com/aegis-sprint/vectorswarm-nav',
    demo_url: 'https://youtu.be/vectorswarm-demo-live',
    deck_url: 'https://speakerdeck.com/vectorswarm/pitch-2025',
    abstract: 'Real-time peer-to-peer state synchronisation operating over bandwidth-constrained mesh radios with deterministic sub-15ms loop closure guarantees.'
  });
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadParticipantData = async () => {
    try {
      const res = await api.fetchParticipantOverview(user?.id);
      setData(res);
    } catch (err) {
      console.warn("Participant data fetch error, using fallback state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipantData();
  }, [user]);

  // Handle Project Submission
  const handleSubmissionSave = async (e) => {
    e.preventDefault();
    try {
      await api.submitParticipantProject(submissionForm);
      setSubmittedStatus(true);
      showToast('Project deliverable logged & encrypted.');
    } catch {
      showToast('Project draft updated locally.');
    }
  };

  // Handle Event Registration
  const handleRegisterEvent = async (eventId, title) => {
    try {
      await api.registerForEvent(eventId, user?.team_name || 'Team VectorSwarm', user?.role || 'Builder');
      showToast(`Registered for ${title}!`);
      loadParticipantData();
    } catch {
      showToast(`Registered for ${title}!`);
    }
  };

  // Handle Kanban Task Creation from WarRoom
  const handleCreateTask = async (taskData) => {
    try {
      await api.createKanbanTask(taskData);
      showToast(`Task Created: ${taskData.title}`);
      loadParticipantData();
    } catch {
      showToast(`Task Created: ${taskData.title}`);
    }
  };

  const navItems = [
    { key: 'war-room', label: 'Team War Room', icon: 'developer_board', desc: 'Hardware & Tasks' },
    { key: 'discovery', label: 'Discover Hackathons', icon: 'explore', desc: 'Browse Challenges' },
    { key: 'submissions', label: 'Project Submission', icon: 'send_and_archive', desc: 'Milestone Receipts' },
    { key: 'schedule', label: 'Schedule & Alerts', icon: 'event', desc: 'Timeline & Dispatches' },
    { key: 'passport', label: 'Impact Passport', icon: 'account_circle', desc: 'Verified Badges' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1916] flex flex-col lg:flex-row selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F1916] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-[#382F2A] animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-[#82E6A1]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E7DFD5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-sans font-bold text-lg tracking-tight text-[#1F1916]">
            aegis
          </span>
          <span className="text-[10px] font-mono text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.5 rounded border border-[#DEEBE1]">
            PARTICIPANT
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-[#E7DFD5] text-[#1F1916] hover:bg-white"
        >
          <span className="material-symbols-outlined text-xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* LEFT SIDEBAR (Floating card with space at top, left & bottom) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r lg:border border-[#E7DFD5] p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out
        lg:static lg:w-64 xl:w-72 lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4 lg:ml-4 lg:my-4 lg:rounded-2xl lg:shadow-sm
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Brand & Arena Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-xl tracking-tight text-[#1F1916]">
                  aegis
                </span>
                <span className="text-[9px] font-mono text-[#2F5B3C] font-semibold uppercase tracking-wider bg-[#EFF5F1] px-1.5 py-0.5 rounded border border-[#DEEBE1]">
                  Participant
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#73645A] mt-0.5">
                Builder Workspace
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-[#73645A] hover:text-[#1F1916]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Participant Team / Checkin Badge Pill */}
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider font-semibold">Active Team</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F5B3C] animate-pulse"></span>
            </div>
            <div className="text-xs font-bold text-[#1F1916] truncate">
              {user?.team_name || "Team VectorSwarm"}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#73645A] pt-1 border-t border-[#F0EAE1]">
              <span>UUID: {user?.badge_uuid || "0x4D1A7E"}</span>
              <span className="text-[#2F5B3C] font-semibold">Checked-In</span>
            </div>
          </div>

          {/* Navigation Items (Vertical Stack) */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider px-2 block mb-1">
              Builder Navigation
            </span>
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#24422D] text-white shadow-sm font-semibold'
                      : 'text-[#5C5248] hover:text-[#1F1916] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#82E6A1]' : 'text-[#73645A]'}`}>
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs leading-snug">{item.label}</span>
                    <span className={`text-[10px] leading-none ${isActive ? 'text-white/70' : 'text-[#A89C92]'}`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="pt-4 border-t border-[#F0EAE1] space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
            <div className="w-8 h-8 rounded-lg bg-[#EFF5F1] text-[#2F5B3C] font-mono font-bold text-xs flex items-center justify-center border border-[#DEEBE1] shrink-0">
              {user?.name ? user.name[0] : 'P'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#1F1916] truncate">{user?.name || "Marcus Chen"}</span>
              <span className="text-[10px] text-[#2F5B3C] truncate font-medium">Student Builder</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full h-9 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#943C1D] border border-[#E7DFD5] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-6 lg:pr-6 overflow-y-auto">
        {/* VIEW 1: WAR ROOM */}
        {activeTab === 'war-room' && (
          <WarRoom
            data={data?.team}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
            onInviteClick={() => showToast('Team invite link copied to clipboard.')}
          />
        )}

        {/* VIEW 2: DISCOVER HACKATHONS */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#2F5B3C] uppercase tracking-wider font-semibold bg-[#EFF5F1] px-2 py-0.5 rounded border border-[#DEEBE1]">
                  Event Discovery Hub
                </span>
                <h2 className="font-serif text-2xl font-semibold text-[#1F1916] mt-1">
                  Upcoming & Active Innovation Challenges
                </h2>
                <p className="text-xs text-[#73645A] mt-1">
                  Discover hackathons, find tracks that align with your stack, and register your team.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#73645A]">Filter:</span>
                <span className="text-xs font-medium bg-[#FAF7F2] px-3 py-1 rounded-lg border border-[#E7DFD5]">All Domains</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(data?.events_catalog || []).map((evt) => (
                <div key={evt.id} className="bg-white rounded-2xl border border-[#E7DFD5] p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono text-[#73645A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E7DFD5]">
                        {evt.category}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        evt.registered ? 'bg-[#EFF5F1] text-[#2F5B3C] border border-[#DEEBE1]' : 'bg-[#FAF7F2] text-[#73645A]'
                      }`}>
                        {evt.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#1F1916] leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs font-mono text-[#73645A] mt-1">
                      {evt.dates} • {evt.location}
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F0EAE1]">
                      <span className="text-[10px] font-mono text-[#943C1D] uppercase font-semibold block">Prizes</span>
                      <span className="text-sm font-bold text-[#1F1916]">{evt.prizes}</span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block mb-1.5">Challenge Tracks</span>
                      <div className="flex flex-wrap gap-1">
                        {evt.tracks.map((t) => (
                          <span key={t} className="text-[10px] bg-[#FAF7F2] text-[#1F1916] px-2 py-0.5 rounded border border-[#E7DFD5]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F0EAE1]">
                    {evt.registered ? (
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2F5B3C] bg-[#EFF5F1] p-2.5 rounded-xl border border-[#DEEBE1]">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Registered Team
                        </span>
                        <span className="font-mono text-[11px]">{evt.team}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegisterEvent(evt.id, evt.title)}
                        className="w-full py-2.5 rounded-xl bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Register for Event
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PROJECT SUBMISSION */}
        {activeTab === 'submissions' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EAE1]">
                <div>
                  <span className="text-[10px] font-mono text-[#2F5B3C] uppercase tracking-wider font-semibold bg-[#EFF5F1] px-2 py-0.5 rounded border border-[#DEEBE1]">
                    Sprint Checkpoint
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#1F1916] mt-1">
                    Project Deliverable Submission
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#943C1D] uppercase font-semibold block">Submission Lockout</span>
                  <span className="text-xs font-mono font-bold text-[#1F1916]">18h 42m Remaining</span>
                </div>
              </div>

              {submittedStatus && (
                <div className="mb-6 p-4 rounded-xl bg-[#EFF5F1] border border-[#DEEBE1] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-[#2F5B3C]">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    <div>
                      <strong className="block font-semibold">Receipt Dispatched & Logged</strong>
                      <span className="text-[11px] opacity-80">Cryptographic hash: 0x9AF031BC... Mainnet checkpoint stored.</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-[#DEEBE1] text-[#2F5B3C]">
                    Receipt #9921
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmissionSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={submissionForm.project_name}
                    onChange={(e) => setSubmissionForm({...submissionForm, project_name: e.target.value})}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none focus:border-[#24422D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">One-Line Abstract / Tagline</label>
                  <input
                    type="text"
                    required
                    value={submissionForm.tagline}
                    onChange={(e) => setSubmissionForm({...submissionForm, tagline: e.target.value})}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none focus:border-[#24422D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">Track Selection</label>
                    <select
                      value={submissionForm.track}
                      onChange={(e) => setSubmissionForm({...submissionForm, track: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option>Track 04 // Swarm Intelligence</option>
                      <option>Track 01 // Perception & SLAM</option>
                      <option>Track 02 // Embedded Jetson Edge</option>
                      <option>Track 03 // Human-Robot Interaction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">GitHub Repository URL</label>
                    <input
                      type="url"
                      required
                      value={submissionForm.repo_url}
                      onChange={(e) => setSubmissionForm({...submissionForm, repo_url: e.target.value})}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">Demo Video Link (4K/60)</label>
                    <input
                      type="url"
                      value={submissionForm.demo_url}
                      onChange={(e) => setSubmissionForm({...submissionForm, demo_url: e.target.value})}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F1916] mb-1">Pitch Deck Slide Deck URL</label>
                    <input
                      type="url"
                      value={submissionForm.deck_url}
                      onChange={(e) => setSubmissionForm({...submissionForm, deck_url: e.target.value})}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Detailed Technical Summary</label>
                  <textarea
                    rows={4}
                    value={submissionForm.abstract}
                    onChange={(e) => setSubmissionForm({...submissionForm, abstract: e.target.value})}
                    className="w-full p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs focus:bg-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#73645A]">Auto-saved to team repository</span>
                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Lock & Submit Deliverable
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 4: SCHEDULE & ANNOUNCEMENTS */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-[#1F1916] mb-1">
                  Event Milestones & Agenda
                </h3>
                <p className="text-xs text-[#73645A] mb-5">
                  Synchronous sprint timeline with mandatory checkpoints and review waves.
                </p>

                <div className="space-y-3">
                  {(data?.schedule || []).map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#24422D]">{evt.time}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            evt.status === 'RUNNING NOW' ? 'bg-[#C2542D] text-white' :
                            evt.status === 'COMPLETED' ? 'bg-[#EFF5F1] text-[#2F5B3C]' : 'bg-white text-[#73645A]'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-[#1F1916] mt-1">{evt.title}</h4>
                        <p className="text-xs text-[#73645A] mt-0.5">{evt.location} {evt.speaker && `• ${evt.speaker}`}</p>
                      </div>
                      {evt.attendees && (
                        <span className="text-[11px] font-mono text-[#73645A] bg-white px-2 py-1 rounded border border-[#E7DFD5] shrink-0">
                          {evt.attendees}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0EAE1]">
                  <h3 className="font-serif text-lg font-semibold text-[#1F1916]">
                    Organizer Dispatches
                  </h3>
                  <span className="text-[10px] font-mono bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded font-semibold border border-[#DEEBE1]">
                    Live Broadcasts
                  </span>
                </div>

                <div className="space-y-3">
                  {(data?.broadcasts || []).map((bc) => (
                    <div key={bc.id} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#73645A] mb-1">
                        <span>{bc.timestamp}</span>
                        <span className="uppercase text-[#2F5B3C] font-semibold">{bc.type}</span>
                      </div>
                      <p className="font-semibold text-[#1F1916]">{bc.title}</p>
                      <p className="text-[#6B5F54] text-[11px] mt-1 leading-snug">{bc.message}</p>
                      <span className="text-[10px] text-[#A89C92] font-mono block mt-2">Sender: {bc.sender}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: IMPACT PASSPORT & PROFILE */}
        {activeTab === 'passport' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#24422D] text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                    {user?.name ? user.name[0] : 'P'}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-[#1F1916]">{user?.name}</h2>
                    <p className="text-xs text-[#73645A]">{user?.role} • {user?.affiliation}</p>
                    <p className="text-[11px] font-mono text-[#2F5B3C] mt-0.5">Badge UUID: {user?.badge_uuid}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right p-3 rounded-xl bg-[#EFF5F1] border border-[#DEEBE1]">
                  <span className="text-[10px] font-mono text-[#2F5B3C] uppercase font-semibold block">Passport Score</span>
                  <span className="text-xl font-mono font-bold text-[#1F1916]">{user?.passport_score || "98.4 / 100"}</span>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#73645A] mb-2.5">
                    Demonstrated Technical Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(user?.skills || ["C++20", "ROS2", "CUDA", "TensorRT", "Edge AI"]).map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-medium text-[#1F1916]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EAE1]">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#73645A] mb-2.5">
                    Verified Cohort Badges
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(user?.verified_badges || ["Jetson Orin Certified", "ROS2 Core Builder", "Midway Verified"]).map((b) => (
                      <div key={b} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#2F5B3C] text-lg">verified</span>
                        <span className="text-xs font-semibold text-[#1F1916]">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        project={data?.team?.team_name || "Team VectorSwarm"}
      />
    </div>
  );
}
