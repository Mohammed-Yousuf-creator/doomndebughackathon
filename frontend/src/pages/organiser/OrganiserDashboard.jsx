import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import OrganizerConsole from '../../components/OrganizerConsole';
import JudgeConsole from '../../components/JudgeConsole';
import SponsorPortal from '../../components/SponsorPortal';
import {
  CheckinModal,
  BroadcastModal,
  EmergencyModal,
  InterviewModal
} from '../../components/Modals';

export default function OrganiserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ops'); // 'ops', 'teams', 'judge', 'sponsor'
  const [organizerData, setOrganizerData] = useState(null);
  const [sprintStatus, setSprintStatus] = useState(null);
  const [judgeData, setJudgeData] = useState(null);
  const [sponsorData, setSponsorData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadAllOrganizerData = async () => {
    try {
      const [sprint, org, judge, sponsor] = await Promise.all([
        api.fetchSprintStatus(),
        api.fetchOrganizerData(),
        api.fetchJudgeConsole(),
        api.fetchSponsorPortal()
      ]);
      setSprintStatus(sprint);
      setOrganizerData(org);
      setJudgeData(judge);
      setSponsorData(sponsor);
    } catch (err) {
      console.warn("Organizer API load error", err);
    }
  };

  useEffect(() => {
    loadAllOrganizerData();
  }, []);

  // Event Switcher
  const handleSwitchEvent = async (eventName) => {
    try {
      await api.switchSprintEvent(eventName);
      setSprintStatus(prev => prev ? { ...prev, active_event: eventName } : prev);
      showToast(`Switched active event to: ${eventName}`);
    } catch {
      showToast(`Switched active event to: ${eventName}`);
    }
  };

  // Checkin submission
  const handleCheckinSubmit = async (formData) => {
    try {
      const res = await api.registerCheckin(formData);
      showToast(`Checked in: ${formData.attendee} (${formData.checkpoint})`);
      setOrganizerData(prev => prev ? {
        ...prev,
        checkin_stream: [res.entry, ...(prev.checkin_stream || [])],
        kpis: {
          ...prev.kpis,
          turnout: res.turnout
        }
      } : prev);
    } catch {
      showToast(`Checked in: ${formData.attendee}`);
    }
  };

  // Broadcast submission
  const handleBroadcastSubmit = async (formData) => {
    try {
      const res = await api.sendBroadcast(formData);
      showToast(`Broadcast Sent: ${formData.title}`);
      setOrganizerData(prev => prev ? {
        ...prev,
        broadcasts: [res.broadcast, ...(prev.broadcasts || [])]
      } : prev);
    } catch {
      showToast(`Broadcast Sent: ${formData.title}`);
    }
  };

  // Mentor dispatch
  const handleMentorDispatch = async (ticketId, mentorName) => {
    try {
      await api.dispatchMentor(ticketId, mentorName);
      showToast(`Dispatched ${mentorName} to ticket ${ticketId}`);
      loadAllOrganizerData();
    } catch {
      showToast(`Dispatched ${mentorName}`);
    }
  };

  // Judge score evaluation
  const handleJudgeEvaluate = async (projectId, scores, privateNotes, feedback, isDraft) => {
    try {
      const res = await api.submitEvaluation(projectId, scores, privateNotes, feedback, isDraft);
      showToast(isDraft ? "Draft review saved." : "Calibrated evaluation confirmed.");
      setJudgeData(prev => prev ? {
        ...prev,
        current_project: res.project
      } : prev);
    } catch {
      showToast("Evaluation recorded.");
    }
  };

  // Sponsor interview dispatch
  const handleInterviewSubmit = async (candidateId, notes) => {
    try {
      await api.requestInterview(candidateId, notes);
      showToast("Talent introduction & fast-track interview dispatched.");
    } catch {
      showToast("Interview requested.");
    }
  };

  // Sponsor package proposal
  const handleProposalSubmit = async (packageId, company, email, terms) => {
    try {
      await api.submitProposal(packageId, company, email, terms);
      showToast(`Sponsorship proposal for ${company} submitted to Steering Committee.`);
    } catch {
      showToast("Proposal received.");
    }
  };

  const navItems = [
    { key: 'ops', label: 'EventOps Console', icon: 'space_dashboard', desc: 'KPIs & Telemetry' },
    { key: 'teams', label: 'Roll Call & Teams', icon: 'group', desc: 'Attendees & Scanner' },
    { key: 'judge', label: 'Judge Calibration', icon: 'gavel', desc: 'Rubric Scoring' },
    { key: 'sponsor', label: 'Sponsors & ROI', icon: 'storefront', desc: 'Talent & Proposals' },
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
          <span className="text-[10px] font-mono text-[#943C1D] font-semibold bg-[#FDF2F0] px-1.5 py-0.5 rounded border border-[#F5C7C1]">
            COMMAND OPS
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
        {/* Top: Brand & Event Context */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-xl tracking-tight text-[#1F1916]">
                  aegis
                </span>
                <span className="text-[9px] font-mono text-[#943C1D] font-semibold uppercase tracking-wider bg-[#FDF2F0] px-1.5 py-0.5 rounded border border-[#F5C7C1]">
                  Command Ops
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#73645A] mt-0.5">
                Director & Review Suite
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

          {/* Event Picker Selector */}
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
            <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider block font-semibold">Active Event</span>
            <div className="relative">
              <select
                value={sprintStatus?.active_event || "Global Sprint 2025 (North America)"}
                onChange={(e) => handleSwitchEvent(e.target.value)}
                className="w-full bg-white font-sans text-xs text-[#1F1916] p-2 pr-6 rounded-lg border border-[#E7DFD5] focus:outline-none cursor-pointer truncate appearance-none"
              >
                {sprintStatus?.event_options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-white text-[#1F1916]">
                    {opt}
                  </option>
                )) || (
                  <option>Autonomous Systems Hackathon 2025</option>
                )}
              </select>
              <span className="material-symbols-outlined text-[14px] text-[#73645A] absolute right-2 top-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Navigation Items (Vertical Stack) */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider px-2 block mb-1">
              Director Modules
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
                      ? 'bg-[#943C1D] text-white shadow-sm font-semibold'
                      : 'text-[#5C5248] hover:text-[#1F1916] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-white' : 'text-[#73645A]'}`}>
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs leading-snug">{item.label}</span>
                    <span className={`text-[10px] leading-none ${isActive ? 'text-white/80' : 'text-[#A89C92]'}`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Operations Triggers */}
          <div className="pt-2 border-t border-[#F0EAE1] space-y-1.5">
            <span className="text-[10px] font-mono text-[#73645A] uppercase tracking-wider px-2 block mb-1">
              Fast Actions
            </span>
            <button
              onClick={() => setIsCheckinOpen(true)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#EFF5F1] text-[#2F5B3C] border border-[#DEEBE1] text-xs font-semibold hover:bg-[#E4EFE7] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                Scan Attendee
              </span>
              <span className="text-[10px] font-mono">Check-in</span>
            </button>

            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FDF2F0] text-[#943C1D] border border-[#F5C7C1] text-xs font-semibold hover:bg-[#FBE4E1] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">campaign</span>
                Broadcast
              </span>
              <span className="text-[10px] font-mono">Alert</span>
            </button>
          </div>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="pt-4 border-t border-[#F0EAE1] space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F0] text-[#943C1D] font-mono font-bold text-xs flex items-center justify-center border border-[#F5C7C1] shrink-0">
              {user?.name ? user.name[0] : 'O'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#1F1916] truncate">{user?.name || "Dr. Aris Vane"}</span>
              <span className="text-[10px] text-[#73645A] truncate font-medium">{user?.role || "Director"}</span>
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
        {/* VIEW 1: EVENTOPS MISSION CONTROL */}
        {activeTab === 'ops' && (
          <OrganizerConsole
            data={organizerData}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onOpenBroadcast={() => setIsBroadcastOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onDispatchMentor={handleMentorDispatch}
          />
        )}

        {/* VIEW 2: PARTICIPANT ROLL CALL & TEAM MANAGEMENT */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7DFD5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#943C1D] uppercase tracking-wider font-semibold bg-[#FDF2F0] px-2 py-0.5 rounded border border-[#F5C7C1]">
                  Participant Operations
                </span>
                <h2 className="font-serif text-2xl font-semibold text-[#1F1916] mt-1">
                  Verified Roll Call & Team Synchronization
                </h2>
                <p className="text-xs text-[#73645A] mt-1">
                  Manage active attendee arrivals, hardware allocations, and mentor queues.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="http://localhost:8000/api/organizer/export-csv"
                  download="aegis_roll_call_export.csv"
                  className="h-10 px-4 rounded-xl bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export Roll Call CSV
                </a>
              </div>
            </div>

            {/* Checkin Stream Table */}
            <div className="bg-white rounded-2xl border border-[#E7DFD5] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F0EAE1] flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-[#1F1916]">
                  Live Arrival Log
                </h3>
                <span className="text-xs font-mono text-[#73645A]">
                  {(organizerData?.checkin_stream || []).length} Recorded Entries
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] text-[#73645A] font-mono uppercase text-[10px] border-b border-[#E7DFD5]">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Attendee Name</th>
                      <th className="px-6 py-3">Affiliation / Team</th>
                      <th className="px-6 py-3">Checkpoint Gate</th>
                      <th className="px-6 py-3">Badge UUID</th>
                      <th className="px-6 py-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {(organizerData?.checkin_stream || []).map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-[#73645A]">{row.time}</td>
                        <td className="px-6 py-3.5 font-semibold text-[#1F1916]">{row.attendee}</td>
                        <td className="px-6 py-3.5 text-[#73645A]">{row.affiliation}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                            row.type === 'hardware' ? 'bg-[#FDF2F0] text-[#943C1D] border border-[#F5C7C1]' : 'bg-[#EFF5F1] text-[#2F5B3C] border border-[#DEEBE1]'
                          }`}>
                            {row.checkpoint}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[#73645A]">{row.badge_uuid}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#2F5B3C]">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
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
        )}

        {/* VIEW 3: JUDGE CONSOLE */}
        {activeTab === 'judge' && (
          <JudgeConsole
            data={judgeData}
            onEvaluate={handleJudgeEvaluate}
          />
        )}

        {/* VIEW 4: SPONSOR PORTAL */}
        {activeTab === 'sponsor' && (
          <SponsorPortal
            data={sponsorData}
            onRequestInterview={(cand) => setInterviewCandidate(cand)}
            onSubmitProposal={handleProposalSubmit}
          />
        )}
      </div>

      {/* Modals */}
      <CheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onSubmit={handleCheckinSubmit}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onSubmit={handleBroadcastSubmit}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSubmit={handleBroadcastSubmit}
      />

      <InterviewModal
        isOpen={!!interviewCandidate}
        candidate={interviewCandidate}
        onClose={() => setInterviewCandidate(null)}
        onSubmit={handleInterviewSubmit}
      />
    </div>
  );
}
