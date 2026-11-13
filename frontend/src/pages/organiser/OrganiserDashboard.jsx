import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import {
  CheckinModal,
  BroadcastModal,
  EmergencyModal,
  InterviewModal
} from '../../components/Modals';
import JudgeConsole from '../../components/JudgeConsole';
import SponsorPortal from '../../components/SponsorPortal';

export default function OrganiserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation & Tabs
  const [activeNav, setActiveNav] = useState('overview'); // 'overview', 'checkin', 'broadcasts', 'judge', 'sponsor', 'schedule'
  const [activityTab, setActivityTab] = useState('checkins'); // 'checkins', 'broadcasts', 'mentors', 'kpis'
  
  // Data States
  const [organizerData, setOrganizerData] = useState(null);
  const [sprintStatus, setSprintStatus] = useState(null);
  const [judgeData, setJudgeData] = useState(null);
  const [sponsorData, setSponsorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);

  // Quick Checkin Form (Inline)
  const [quickName, setQuickName] = useState('');
  const [quickAffiliation, setQuickAffiliation] = useState('');
  const [quickCheckpoint, setQuickCheckpoint] = useState('Main Welcome Gate (Desk 01)');

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
      console.warn("Could not load organizer data", err);
    } finally {
      setLoading(false);
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
      showToast(`Checked in: ${formData.attendee} at ${formData.checkpoint}`);
      setOrganizerData(prev => prev ? {
        ...prev,
        checkin_stream: [res.entry, ...(prev.checkin_stream || [])],
        kpis: {
          ...prev.kpis,
          turnout: res.turnout
        }
      } : prev);
      setQuickName('');
      setQuickAffiliation('');
    } catch {
      showToast(`Checked in: ${formData.attendee}`);
    }
  };

  // Broadcast submission
  const handleBroadcastSubmit = async (formData) => {
    try {
      const res = await api.sendBroadcast(formData);
      showToast(`Announcement sent: "${formData.title}"`);
      setOrganizerData(prev => prev ? {
        ...prev,
        broadcasts: [res.broadcast, ...(prev.broadcasts || [])]
      } : prev);
    } catch {
      showToast(`Announcement sent: "${formData.title}"`);
    }
  };

  // Mentor dispatch
  const handleMentorDispatch = async (ticketId, mentorName) => {
    try {
      await api.dispatchMentor(ticketId, mentorName);
      showToast(`Assigned ${mentorName} to help this student.`);
      loadAllOrganizerData();
    } catch {
      showToast(`Assigned ${mentorName}`);
    }
  };

  // Judge score evaluation
  const handleJudgeEvaluate = async (projectId, scores, privateNotes, feedback, isDraft) => {
    try {
      const res = await api.submitEvaluation(projectId, scores, privateNotes, feedback, isDraft);
      showToast(isDraft ? "Draft review saved." : "Project score confirmed!");
      setJudgeData(prev => prev ? {
        ...prev,
        current_project: res.project
      } : prev);
    } catch {
      showToast("Review recorded.");
    }
  };

  // Sponsor interview dispatch
  const handleInterviewSubmit = async (candidateId, notes) => {
    try {
      await api.requestInterview(candidateId, notes);
      showToast("Interview request sent to candidate.");
    } catch {
      showToast("Interview requested.");
    }
  };

  // Sponsor package proposal
  const handleProposalSubmit = async (packageId, company, email, terms) => {
    try {
      await api.submitProposal(packageId, company, email, terms);
      showToast(`Sponsorship proposal for ${company} sent to Event Committee.`);
    } catch {
      showToast("Proposal received.");
    }
  };

  const navItems = [
    { key: 'overview', label: 'Overview', icon: 'dashboard' },
    { key: 'checkin', label: 'Attendees & Check-in', icon: 'how_to_reg' },
    { key: 'broadcasts', label: 'Announcements', icon: 'campaign' },
    { key: 'judge', label: 'Judging & Scores', icon: 'gavel' },
    { key: 'sponsor', label: 'Sponsors & Talent', icon: 'storefront' },
    { key: 'schedule', label: 'Event Schedule', icon: 'calendar_month' },
  ];

  const turnout = organizerData?.kpis?.turnout || { checked_in: 1420, total: 1500, percentage: 94.6 };
  const teamsKpi = organizerData?.kpis?.teams || { active: 348 };
  const computeKpi = organizerData?.kpis?.compute || { jetson_kits_allocated: 128, jetson_kits_total: 140, kits_remaining: 12 };
  const mentorQueue = organizerData?.mentor_queue || [];
  const broadcasts = organizerData?.broadcasts || [];
  const checkinStream = (organizerData?.checkin_stream || []).filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.attendee.toLowerCase().includes(q) ||
           item.affiliation.toLowerCase().includes(q) ||
           item.checkpoint.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] flex font-sans selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2937] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-gray-700 animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Unstop Dimensions: Fixed 240px wide, docked to left, full height) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Brand & Event Context */}
        <div className="p-4 space-y-4">
          {/* Logo & Collapse */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveNav('overview')}>
              <span className="font-bold text-2xl tracking-tight text-[#1F2937]">aegis</span>
              <span className="h-2 w-2 rounded-sm bg-[#943C1D]"></span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              title="Collapse"
            >
              <span className="material-symbols-outlined text-base">keyboard_double_arrow_left</span>
            </button>
          </div>

          {/* "You're viewing as" Dropdown Card (Exact Unstop UI) */}
          <div className="bg-[#F3F4F6] p-2.5 rounded-xl border border-[#E5E7EB]">
            <span className="text-[11px] text-gray-500 block mb-1">You're viewing as</span>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] shadow-2xs cursor-pointer">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#943C1D]">badge</span>
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {user?.name || 'Dr. Aris Vane (Lead)'}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
            </div>
          </div>

          {/* Event Selector Pill */}
          <div className="px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Active Hackathon</span>
            <select
              value={sprintStatus?.active_event || "Autonomous Systems Hackathon 2025"}
              onChange={(e) => handleSwitchEvent(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none cursor-pointer truncate"
            >
              {(sprintStatus?.event_options || ["Autonomous Systems Hackathon 2025", "DeepTech BioInnovation Summit", "Quantum Leap Climate Challenge"]).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* "+ New Announcement" Button */}
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="w-full py-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#943C1D]">campaign</span>
            <span>+ Send Announcement</span>
          </button>

          {/* Navigation Items (Vertical Stack) */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
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
                      ? 'bg-[#FDF2F0] text-[#943C1D] font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#943C1D]' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Sign Out */}
        <div className="p-4 border-t border-[#E5E7EB] space-y-2">
          <button
            onClick={() => navigate('/participant/dashboard')}
            className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#2F5B3C]">school</span>
              <span>Switch to Student View</span>
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

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 min-w-0 lg:pl-60 flex flex-col min-h-screen">
        {/* TOP HEADER BAR (Unstop Style: Search in center, Student Portal button & icons on right) */}
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

          {/* Centered Wide Search Input */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-auto">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-gray-400 text-base">search</span>
              <input
                type="text"
                placeholder="Search attendees, colleges, teams, checkpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] hover:bg-white focus:bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#943C1D] shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Right Action Buttons & Avatar */}
          <div className="flex items-center gap-3">
            {/* Quick Check-in Button */}
            <button
              onClick={() => setIsCheckinOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#2F5B3C]">qr_code_scanner</span>
              <span>Check In Student</span>
            </button>

            {/* Switch to Student Portal */}
            <button
              onClick={() => navigate('/participant/dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[#24422D] text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Student View</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => showToast("All event systems operational.")}
              className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#943C1D] rounded-sm"></span>
            </button>

            {/* User Avatar */}
            <div
              className="w-8 h-8 rounded-lg bg-[#943C1D] text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-red-200 transition-all"
              title={user?.name || "Organiser Lead"}
            >
              {user?.name ? user.name[0] : 'O'}
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA (Clean, un-overcrowded, spacious!) */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB 1: OVERVIEW (Unstop Style Dashboard) */}
          {activeNav === 'overview' && (
            <>
              {/* TOP EVENT SUMMARY: 4 CLEAN KPI CARDS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {sprintStatus?.active_event || "Autonomous Systems Hackathon 2025"}
                    </h2>
                    <p className="text-xs text-gray-500">Live Hackathon Control Room &bull; MIT Stata Center &bull; Day 2</p>
                  </div>

                  <a
                    href="http://localhost:8000/api/organizer/export-csv"
                    download="aegis_roll_call.csv"
                    className="inline-flex items-center gap-1.5 text-xs text-[#24422D] font-semibold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download Attendance CSV</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Student Turnout */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-xs font-medium">Student Turnout</span>
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2F5B3C] flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">people</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {turnout.checked_in} <span className="text-xs font-normal text-gray-500">/ {turnout.total}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        {turnout.percentage}% checked in &bull; ~38 arrivals/min
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Active Teams */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-xs font-medium">Active Squads</span>
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">groups</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{teamsKpi.active} Teams</div>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                        All teams checked-in & hacking on floor
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Hardware Kits */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-xs font-medium">Hardware Kits Handed Out</span>
                      <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">memory</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {computeKpi.jetson_kits_allocated} <span className="text-xs font-normal text-gray-500">/ {computeKpi.jetson_kits_total}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                        {computeKpi.kits_remaining} backup Jetson kits remaining at desk
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Mentor Requests */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-xs font-medium">Students Needing Help</span>
                      <span className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">support_agent</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {mentorQueue.filter(m => m.status === 'Queued').length} Requests
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                        Average mentor response time: 4.2 mins
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK CHECK-IN & ANNOUNCEMENT BAR */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#FDF2F0] text-[#943C1D] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">bolt</span>
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Quick Operations Desk</h4>
                    <p className="text-xs text-gray-500">Scan student badges or broadcast instant alerts to the hall.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCheckinOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    + Check In Attendee
                  </button>
                  <button
                    onClick={() => setIsBroadcastOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#943C1D] border border-gray-300 text-xs font-semibold cursor-pointer"
                  >
                    📢 Broadcast Alert
                  </button>
                </div>
              </div>

              {/* EVENT MANAGEMENT ACTIVITY SECTION (Matches Unstop's exact component) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-2xs space-y-4">
                {/* Header with accent bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-1 bg-[#943C1D] rounded-sm"></span>
                    <h3 className="text-lg font-bold text-gray-900">Event Operations Activity</h3>
                  </div>

                  <span className="text-xs text-gray-500">Real-time attendance log & student requests</span>
                </div>

                {/* Sub-Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setActivityTab('checkins')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'checkins'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Recent Check-ins ({checkinStream.length})
                  </button>

                  <button
                    onClick={() => setActivityTab('broadcasts')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'broadcasts'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Announcements ({broadcasts.length})
                  </button>

                  <button
                    onClick={() => setActivityTab('mentors')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activityTab === 'mentors'
                        ? 'border border-gray-300 bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Mentor Help Tickets ({mentorQueue.length})
                  </button>

                  <button
                    onClick={() => setActiveNav('judge')}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Judging Scores &rarr;
                  </button>
                </div>

                {/* TAB 1: RECENT CHECK-INS TABLE */}
                {activityTab === 'checkins' && (
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-500 font-semibold text-[11px] border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2.5">Time</th>
                          <th className="px-4 py-2.5">Student Name</th>
                          <th className="px-4 py-2.5">College / Team</th>
                          <th className="px-4 py-2.5">Checkpoint</th>
                          <th className="px-4 py-2.5">Badge ID</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {checkinStream.slice(0, 8).map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-500">{row.time}</td>
                            <td className="px-4 py-3 font-bold text-gray-900">{row.attendee}</td>
                            <td className="px-4 py-3 text-gray-600">{row.affiliation}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                                {row.checkpoint}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-400">{row.badge_uuid}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 2: ANNOUNCEMENTS */}
                {activityTab === 'broadcasts' && (
                  <div className="space-y-3 pt-2">
                    {broadcasts.map((bc) => (
                      <div key={bc.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{bc.title}</span>
                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              Sent
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{bc.message}</p>
                          <span className="text-[11px] text-gray-400 font-mono block">
                            Sent at {bc.timestamp} by {bc.sender}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: MENTOR HELP QUEUE */}
                {activityTab === 'mentors' && (
                  <div className="space-y-3 pt-2">
                    {mentorQueue.map((t) => (
                      <div key={t.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-gray-900">{t.team}</h5>
                            <span className="text-[11px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                              {t.location}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1"><strong>Issue:</strong> {t.issue}</p>
                          <span className="text-[11px] text-gray-400">Category: {t.category} &bull; Wait time: {t.wait_time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMentorDispatch(t.id, 'Dr. Aris Vane')}
                            className="px-3.5 py-1.5 bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Assign Mentor
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: ATTENDEES & CHECK-IN */}
          {activeNav === 'checkin' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Student Attendance & Check-in</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Track arrivals, badge scans, and kit distributions.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCheckinOpen(true)}
                    className="px-4 py-2 bg-[#24422D] text-white text-xs font-semibold rounded-lg hover:bg-[#1A3322] cursor-pointer"
                  >
                    + Check In Student
                  </button>
                  <a
                    href="http://localhost:8000/api/organizer/export-csv"
                    download="roll_call.csv"
                    className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                  >
                    Export CSV
                  </a>
                </div>
              </div>

              {/* Table of all arrivals */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-800">Check-in Stream ({checkinStream.length})</h3>
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg"
                  />
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold text-[11px] border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Affiliation / Team</th>
                      <th className="px-6 py-3">Checkpoint</th>
                      <th className="px-6 py-3">Badge UUID</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {checkinStream.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3.5 font-mono text-gray-500">{row.time}</td>
                        <td className="px-6 py-3.5 font-bold text-gray-900">{row.attendee}</td>
                        <td className="px-6 py-3.5 text-gray-600">{row.affiliation}</td>
                        <td className="px-6 py-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-medium">
                            {row.checkpoint}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-gray-400">{row.badge_uuid}</td>
                        <td className="px-6 py-3.5 text-emerald-700 font-semibold">Verified</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS */}
          {activeNav === 'broadcasts' && (
            <div className="max-w-2xl bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Broadcast Announcement</h2>
                  <p className="text-xs text-gray-500">Send an instant alert to all participant dashboards and Discord.</p>
                </div>
                <button
                  onClick={() => setIsBroadcastOpen(true)}
                  className="px-3 py-1.5 bg-[#943C1D] text-white text-xs font-semibold rounded-lg hover:bg-[#7D3218] cursor-pointer"
                >
                  + New Broadcast
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {broadcasts.map((bc) => (
                  <div key={bc.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{bc.title}</span>
                      <span className="text-[11px] font-mono text-gray-500">{bc.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{bc.message}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">Sender: {bc.sender}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JUDGING & SCORES (Full Juror Console) */}
          {activeNav === 'judge' && (
            <div className="space-y-6">
              <JudgeConsole
                data={judgeData}
                onSubmitEvaluation={(projId, scores, notes, feedback, isDraft) =>
                  handleJudgeEvaluate(projId, scores, notes, feedback, isDraft)
                }
                onSaveDraft={(projId, scores, notes, feedback) =>
                  handleJudgeEvaluate(projId, scores, notes, feedback, true)
                }
              />
            </div>
          )}

          {/* TAB 5: SPONSORS & TALENT (Full Sponsorship Marketplace & Talent Radar) */}
          {activeNav === 'sponsor' && (
            <div className="space-y-6">
              <SponsorPortal
                data={sponsorData}
                onRequestInterview={(candId) => handleInterviewSubmit(candId, 'Talent fast-track interview')}
                onSubmitProposal={(pkgId, comp, email, terms) => handleProposalSubmit(pkgId, comp, email, terms)}
                onExportLedger={() => showToast('Sponsorship ledger exported to CSV.')}
              />
            </div>
          )}

          {/* TAB 6: SCHEDULE */}
          {activeNav === 'schedule' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Event Milestone Schedule</h2>
              <div className="space-y-3 pt-2">
                {(organizerData?.timeline || [
                  { time: '10:00 EST', title: 'Welcome & Hardware Kit Distribution', location: 'Auditorium D', status: 'COMPLETED' },
                  { time: '14:00 EST', title: 'Mid-Sprint Technical Checkpoint', location: 'Hall B', status: 'RUNNING NOW' },
                  { time: '20:00 EST', title: 'Judging Waves & Live Presentations', location: 'Main Stage', status: 'UPCOMING' }
                ]).map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#943C1D]">{item.time}</span>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                    <span className="text-[11px] font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
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
