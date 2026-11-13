import React, { useState, useEffect } from 'react';

export default function OrganizerConsole({
  data,
  onCheckinClick,
  onBroadcastClick,
  onEmergencyClick,
  onExportCsv,
  onDispatchMentor
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [masterClock, setMasterClock] = useState('');

  // Real-time clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setMasterClock(now.toLocaleTimeString('en-US', { hour12: false }) + ' EST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const kpis = data?.kpis || {};
  const turnout = kpis.turnout || { checked_in: 1420, total: 1500, percentage: 94.6, throughput: '~38 scans/min avg' };
  const teams = kpis.teams || { active: 348, synchronized_repos: 312, sync_percentage: 89.6, missing_first_commit: 36 };
  const staff = kpis.staff || { volunteers_on_duty: 42, active_dispatches: 18, avg_response_velocity: '4.2 min avg' };
  const compute = kpis.compute || { jetson_kits_allocated: 128, jetson_kits_total: 140, kits_remaining: 12, cloud_compute_allocated: '$64k' };

  const timeline = data?.timeline || [];
  const checkinStream = data?.checkin_stream || [];
  const mentorQueue = data?.mentor_queue || [];
  const telemetry = data?.telemetry || {};

  const filteredCheckins = checkinStream.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.attendee.toLowerCase().includes(q) ||
      item.affiliation.toLowerCase().includes(q) ||
      item.badge_uuid.toLowerCase().includes(q) ||
      item.checkpoint.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Event Header Banner */}
      <div className="bg-white rounded-xl p-5 mb-5 border border-[#E7DFD5] shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-2 py-0.5 rounded border border-[#DEEBE1]">
                MIT CSAIL & Robotics Guild
              </span>
              <span className="text-[#A89C92] text-xs">•</span>
              <span className="font-mono text-xs text-[#73645A]">
                Venue: Stata Center 4th Fl + Global Remote
              </span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-[#1F1916]">
              Autonomous Systems Hackathon 2025
            </h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#73645A] flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-[#2F5B3C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C] animate-pulse"></span>
                Day 2 Checkpoint
              </span>
              <span className="text-[#DDD2C5]">•</span>
              <span className="font-mono text-[#1F1916] font-medium">{masterClock}</span>
              <span className="text-[#DDD2C5]">•</span>
              <span>348 Active Teams</span>
              <span className="text-[#DDD2C5]">•</span>
              <span className="text-[#2F5B3C] font-medium">Telemetry Synced (0.14s)</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <button
              onClick={onBroadcastClick}
              className="inline-flex items-center gap-1.5 bg-[#C2542D] hover:bg-[#A8431F] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-subtle cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              <span>Send Announcement</span>
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F8F5F0] text-[#1F1916] text-xs font-medium px-3.5 py-2 rounded-lg border border-[#E7DFD5] transition-colors shadow-subtle cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#73645A]">download</span>
              <span>Export Roll Call (CSV)</span>
            </button>

            <button
              onClick={onEmergencyClick}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FDF2F2] text-[#B83A3A] text-xs font-medium px-3 py-2 rounded-lg border border-[#F0D5D5] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Sleek KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Attendance */}
        <div className="bg-white p-4 rounded-xl border border-[#E7DFD5] shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#73645A] font-medium">
              <span>Turnout & Check-in</span>
              <span className="font-mono text-[11px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.5 rounded">
                +8.4% vs T-12h
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sans font-bold text-2xl text-[#1F1916]">
                {turnout.checked_in?.toLocaleString()}
              </span>
              <span className="text-xs text-[#73645A]">
                / {turnout.total?.toLocaleString()} registered
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#F3EFEA] h-1.5 rounded-md overflow-hidden">
              <div
                className="bg-[#2F5B3C] h-full rounded-md transition-all duration-500"
                style={{ width: `${turnout.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#73645A] mt-1.5 font-mono">
              <span>{turnout.percentage}% checked in</span>
              <span>~38 scans/min</span>
            </div>
          </div>
        </div>

        {/* Repositories */}
        <div className="bg-white p-4 rounded-xl border border-[#E7DFD5] shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#73645A] font-medium">
              <span>Connected Repos</span>
              <span className="font-mono text-[11px] text-[#C47D1C] font-semibold bg-[#FDF6EA] px-1.5 py-0.5 rounded">
                {teams.missing_first_commit} missing commit
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sans font-bold text-2xl text-[#1F1916]">
                {teams.synchronized_repos}
              </span>
              <span className="text-xs text-[#73645A]">
                / {teams.active} teams
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#F3EFEA] h-1.5 rounded-md overflow-hidden">
              <div
                className="bg-[#C47D1C] h-full rounded-md transition-all duration-500"
                style={{ width: `${teams.sync_percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#73645A] mt-1.5 font-mono">
              <span>{teams.sync_percentage}% synchronized</span>
              <span>GitHub Webhooks Active</span>
            </div>
          </div>
        </div>

        {/* Mentors */}
        <div className="bg-white p-4 rounded-xl border border-[#E7DFD5] shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#73645A] font-medium">
              <span>Mentorship & Helpdesk</span>
              <span className="font-mono text-[11px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.5 rounded">
                4.2m avg response
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sans font-bold text-2xl text-[#1F1916]">
                {staff.active_dispatches}
              </span>
              <span className="text-xs text-[#73645A]">
                active / {staff.volunteers_on_duty} on duty
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] bg-[#FAF7F2] p-1.5 rounded-md border border-[#F0EAE1]">
              <span className="text-[#73645A]">Active Help Tickets:</span>
              <span className="font-bold text-[#1F1916]">4 Pending Dispatch</span>
            </div>
          </div>
        </div>

        {/* Hardware & Compute */}
        <div className="bg-white p-4 rounded-xl border border-[#E7DFD5] shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#73645A] font-medium">
              <span>Jetson AGX Kit Loans</span>
              <span className="font-mono text-[11px] text-[#C2542D] font-semibold bg-[#FBEFEA] px-1.5 py-0.5 rounded">
                {compute.kits_remaining} left in stock
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sans font-bold text-2xl text-[#1F1916]">
                {compute.jetson_kits_allocated}
              </span>
              <span className="text-xs text-[#73645A]">
                / {compute.jetson_kits_total} kits issued
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#F3EFEA] h-1.5 rounded-md overflow-hidden">
              <div
                className="bg-[#C2542D] h-full rounded-md transition-all duration-500"
                style={{ width: `${(compute.jetson_kits_allocated / compute.jetson_kits_total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#73645A] mt-1.5 font-mono">
              <span>Cloud: {compute.cloud_compute_allocated} Activated</span>
              <span>AWS / Lambda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Timeline & Integrity (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Timeline */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#73645A]">schedule</span>
                <h2 className="font-sans font-bold text-sm text-[#1F1916]">Run-of-Show Milestones</h2>
              </div>
              <span className="font-mono text-[10px] text-[#2F5B3C] bg-[#EFF5F1] px-2 py-0.5 rounded font-semibold">
                Live State
              </span>
            </div>

            <div className="flex flex-col gap-3 relative pl-3">
              <div className="absolute left-1 top-2 bottom-3 w-px bg-[#E7DFD5]"></div>

              {timeline.map((item, idx) => {
                const isRunning = item.status === "RUNNING NOW";
                const isDone = item.status === "COMPLETED";

                return (
                  <div key={item.id || idx} className="relative flex items-start gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full -ml-[17px] mt-1.5 shrink-0 ${
                        isRunning
                          ? 'bg-[#C2542D] ring-4 ring-[#C2542D]/20'
                          : isDone
                          ? 'bg-[#A89C92]'
                          : 'bg-[#DDD2C5]'
                      }`}
                    ></div>

                    <div
                      className={`flex-1 p-2.5 rounded-lg border text-xs transition-all ${
                        isRunning
                          ? 'bg-[#FAF7F2] border-[#C2542D]/30 shadow-subtle'
                          : 'bg-white border-[#E7DFD5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#73645A]">{item.time}</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            isRunning
                              ? 'bg-[#C2542D] text-white'
                              : isDone
                              ? 'bg-[#F3EFEA] text-[#73645A]'
                              : 'bg-[#F3EFEA] text-[#73645A]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-semibold text-xs text-[#1F1916] mt-1 leading-snug">
                        {item.title}
                      </h3>

                      {item.speaker && (
                        <p className="text-[11px] text-[#2F5B3C] font-medium mt-0.5">
                          Speaker: {item.speaker}
                        </p>
                      )}

                      {item.location && (
                        <p className="text-[11px] text-[#73645A] mt-0.5">
                          {item.location}
                        </p>
                      )}

                      {item.attendees && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] font-mono text-[#73645A]">
                          <span>{item.elapsed || "Running"}</span>
                          <span className="text-[#2F5B3C] font-medium">{item.attendees}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code & Integrity Telemetry */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#73645A]">verified_user</span>
                <h2 className="font-sans font-bold text-sm text-[#1F1916]">Code & Integrity Telemetry</h2>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C]"></span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1F1916] block">
                    {telemetry.github_sync?.name || "GitHub Enterprise Webhook Sync"}
                  </span>
                  <span className="font-mono text-[11px] text-[#73645A]">
                    {telemetry.github_sync?.push_events?.toLocaleString() || "2,491"} push commits tracked
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded font-semibold">
                  STABLE
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1F1916] block">
                    AST Pre-Build Plagiarism Scanner
                  </span>
                  <span className="text-[11px] text-[#73645A]">
                    Origin verified across active repos
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded font-semibold">
                  0 FLAGS
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1F1916] block">
                    Docker Build Runners (AWS ECS)
                  </span>
                  <span className="font-mono text-[11px] text-[#73645A]">
                    32/32 worker instances healthy
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded font-semibold">
                  100% PASS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Check-in Desk & Mentor Queue (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Check-in Desk */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#F0EAE1]">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#73645A]">qr_code_scanner</span>
                  <h2 className="font-sans font-bold text-sm text-[#1F1916]">
                    Participant QR Check-in & Hardware Desk
                  </h2>
                </div>
                <p className="text-[11px] text-[#73645A] mt-0.5">
                  Live access validation across Gate A, B, C and Stata Concourse.
                </p>
              </div>

              <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded font-semibold self-start sm:self-auto">
                4 Gates Operational
              </span>
            </div>

            {/* Search & Fast Manual Scan */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#73645A] text-[17px]">search</span>
                <input
                  type="text"
                  placeholder="Search attendee name, team, affiliation, or UUID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-[#FAF7F2] rounded-lg text-xs text-[#1F1916] placeholder:text-[#A89C92] border border-[#E7DFD5] focus:outline-none focus:bg-white focus:border-[#C2542D] transition-colors"
                />
              </div>
              <button
                onClick={onCheckinClick}
                className="h-8 px-3 bg-[#2F5B3C] hover:bg-[#254B31] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                <span>Fast Scan</span>
              </button>
            </div>

            {/* Checkin Stream Table */}
            <div className="overflow-x-auto rounded-lg border border-[#E7DFD5]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] font-mono text-[10px] text-[#73645A] uppercase border-b border-[#E7DFD5]">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Attendee</th>
                    <th className="py-2 px-3">Team / Affiliation</th>
                    <th className="py-2 px-3">Checkpoint</th>
                    <th className="py-2 px-3 text-right">Badge UUID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {filteredCheckins.slice(0, 7).map((chk) => (
                    <tr key={chk.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] text-[#73645A]">
                        {chk.time}
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#1F1916]">
                        {chk.attendee}
                      </td>
                      <td className="py-2 px-3 text-[#73645A]">
                        {chk.affiliation}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            chk.type === 'hardware'
                              ? 'bg-[#FBEFEA] text-[#C2542D]'
                              : 'bg-[#F3EFEA] text-[#1F1916]'
                          }`}
                        >
                          {chk.checkpoint}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[11px] text-[#A89C92]">
                        {chk.badge_uuid}
                      </td>
                    </tr>
                  ))}
                  {filteredCheckins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-5 text-center text-[#A89C92] text-xs">
                        No check-in entries found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mentor Helpdesk Queue */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#C47D1C]">contact_support</span>
                <h2 className="font-sans font-bold text-sm text-[#1F1916]">
                  Mentor & Technical Helpdesk Queue
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#73645A]">
                {mentorQueue.filter(m => m.status === 'Queued').length} pending dispatch
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E7DFD5]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] font-mono text-[10px] text-[#73645A] uppercase border-b border-[#E7DFD5]">
                    <th className="py-2 px-3">Team</th>
                    <th className="py-2 px-3">Subsystem / Issue</th>
                    <th className="py-2 px-3">Urgency</th>
                    <th className="py-2 px-3">Wait</th>
                    <th className="py-2 px-3 text-right">Mentor Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {mentorQueue.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#1F1916] block">{ticket.team}</span>
                        <span className="font-mono text-[10px] text-[#73645A]">{ticket.location}</span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#2F5B3C] block">{ticket.category}</span>
                        <p className="text-[11px] text-[#73645A] line-clamp-1 max-w-xs">{ticket.issue}</p>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            ticket.urgency === 'Urgent'
                              ? 'bg-[#FDF2F2] text-[#B83A3A]'
                              : ticket.urgency === 'High'
                              ? 'bg-[#FBEFEA] text-[#C2542D]'
                              : 'bg-[#F3EFEA] text-[#73645A]'
                          }`}
                        >
                          {ticket.urgency}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#73645A]">
                        {ticket.wait_time}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {ticket.status === 'Queued' ? (
                          <button
                            onClick={() => onDispatchMentor && onDispatchMentor(ticket.id, "Dr. Sarah Lin")}
                            className="bg-[#2F5B3C] hover:bg-[#254B31] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Dispatch
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-2 py-0.5 rounded">
                            {ticket.assigned_mentor}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
