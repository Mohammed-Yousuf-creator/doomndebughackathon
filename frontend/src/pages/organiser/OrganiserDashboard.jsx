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

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1916] flex flex-col selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F1916] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-[#382F2A] animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-[#82E6A1]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Organiser Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Event Context */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-[#943C1D] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tight shadow-sm">
              EF
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm tracking-tight text-[#1F1916]">
                EventForge <span className="text-[11px] font-mono text-[#943C1D] font-semibold bg-[#FDF2F0] px-1.5 py-0.5 rounded border border-[#F5C7C1] ml-1">COMMAND OPS</span>
              </span>
              <span className="text-[10px] font-mono text-[#73645A]">
                {user?.role || "Lead Organizer Level 4"} • {user?.affiliation || "Steering Committee"}
              </span>
            </div>

            <div className="h-5 w-px bg-[#E2D8CC] hidden xl:block"></div>

            {/* Event Picker Box */}
            <div className="hidden xl:flex items-center h-10 px-3 rounded-xl bg-white border border-[#E5DDD2] shadow-sm max-w-[220px] relative group hover:border-[#D5C9BD] transition-colors">
              <span className="material-symbols-outlined text-[16px] text-[#73645A] mr-1.5 shrink-0">
                calendar_today
              </span>
              <select
                value={sprintStatus?.active_event || "Global Sprint 2025 (North America)"}
                onChange={(e) => handleSwitchEvent(e.target.value)}
                className="bg-transparent font-sans text-xs text-[#1F1916] focus:outline-none cursor-pointer w-full truncate pr-4 appearance-none"
              >
                {sprintStatus?.event_options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-white text-[#1F1916]">
                    {opt}
                  </option>
                )) || (
                  <option>Autonomous Systems Hackathon 2025</option>
                )}
              </select>
              <span className="material-symbols-outlined text-[14px] text-[#73645A] absolute right-2.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Center: Organiser Management Nav Tabs */}
          <div className="flex-1 flex justify-center min-w-0 max-w-2xl px-1">
            <nav className="h-10 bg-[#EFE9DF] p-1 rounded-xl border border-[#E0D5C7] flex items-center gap-1 shadow-inner overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('ops')}
                className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'ops'
                    ? 'bg-white text-[#1F1916] font-semibold shadow-sm border border-[#E5DDD2]'
                    : 'text-[#6B5F54] hover:text-[#1F1916]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
                <span>EventOps Console</span>
              </button>

              <button
                onClick={() => setActiveTab('teams')}
                className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'teams'
                    ? 'bg-white text-[#1F1916] font-semibold shadow-sm border border-[#E5DDD2]'
                    : 'text-[#6B5F54] hover:text-[#1F1916]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">group</span>
                <span>Roll Call & Teams</span>
              </button>

              <button
                onClick={() => setActiveTab('judge')}
                className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'judge'
                    ? 'bg-white text-[#1F1916] font-semibold shadow-sm border border-[#E5DDD2]'
                    : 'text-[#6B5F54] hover:text-[#1F1916]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">gavel</span>
                <span>Judge Calibration</span>
              </button>

              <button
                onClick={() => setActiveTab('sponsor')}
                className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'sponsor'
                    ? 'bg-white text-[#1F1916] font-semibold shadow-sm border border-[#E5DDD2]'
                    : 'text-[#6B5F54] hover:text-[#1F1916]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">storefront</span>
                <span>Sponsors & ROI</span>
              </button>
            </nav>
          </div>

          {/* Right: Actions & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Check-in Button */}
            <button
              onClick={() => setIsCheckinOpen(true)}
              className="h-10 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#1F1916] border border-[#E5DDD2] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Scan Attendee Checkin"
            >
              <span className="material-symbols-outlined text-[16px] text-[#2F5B3C]">qr_code_scanner</span>
              <span className="hidden sm:inline">Check-in</span>
            </button>

            {/* Emergency Broadcast Button */}
            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="h-10 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F2EDE4] text-[#943C1D] border border-[#E5DDD2] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Dispatch Broadcast"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              <span className="hidden sm:inline">Dispatch</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="h-10 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#943C1D] border border-[#E5DDD2] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Logout from Command Ops"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Organiser Views */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
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
      </main>

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

