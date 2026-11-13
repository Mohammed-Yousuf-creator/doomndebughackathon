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
  const [selectedGate, setSelectedGate] = useState('ALL');

  // Master live clock update
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

  // Filter check-in stream based on search query
  const filteredCheckins = checkinStream.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (
      item.attendee.toLowerCase().includes(q) ||
      item.affiliation.toLowerCase().includes(q) ||
      item.badge_uuid.toLowerCase().includes(q) ||
      item.checkpoint.toLowerCase().includes(q)
    );
    return matchesQuery;
  });

  return (
    <div className="flex flex-col w-full pb-16 animate-fadeIn">
      {/* Top Operational Context Banner */}
      <div className="bg-surface-container-low py-2.5 px-4 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-container-high">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
            Cluster Node:
          </span>
          <span className="font-mono font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
            {data?.sprint?.cluster_node || "MIT-CSAIL-RBL-04"}
          </span>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-medium">
            {data?.sprint?.auth_level || "Auth: Lead Organizer Level 4"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider">
              Telemetry Synced ({data?.sprint?.latency || "0.14s"})
            </span>
          </div>
          <span className="text-outline">|</span>
          <span className="text-on-surface-variant font-semibold">
            Session {data?.sprint?.session || "#908-OPS"}
          </span>
        </div>
      </div>

      {/* 1. Operations Command Bar */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl mb-6 shadow-sm border border-surface-container-high flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-primary text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Sprint Ops Core
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              MIT CSAIL & Robotics Guild
            </span>
            <span className="font-mono text-xs bg-surface-container-high text-on-surface px-2 py-0.5 rounded border border-surface-container-highest">
              ID: {data?.sprint?.id || "MIT-2025-AUTONOMY"}
            </span>
          </div>

          <h1 className="font-headline font-extrabold text-2xl lg:text-3xl text-on-surface tracking-tight mt-1">
            {data?.sprint?.name || "Autonomous Systems Hackathon 2025"}
          </h1>

          <div className="flex items-center gap-3 flex-wrap pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-surface-container-high">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span className="font-mono text-xs text-secondary font-bold">
                Day 2 — Mid-Sprint Checkpoint
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-lg border border-surface-container-high">
              <span className="material-symbols-outlined text-sm text-primary">timer</span>
              <span className="font-mono text-xs text-primary font-bold">
                {masterClock || "14:32:08 EST"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm text-primary">verified</span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-auto">
          <button
            onClick={onBroadcastClick}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">campaign</span>
            <span>Broadcast Announcement</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-surface-container-high active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-primary">download</span>
            <span>Export Roll Call (CSV)</span>
          </button>

          <button
            onClick={onEmergencyClick}
            className="inline-flex items-center gap-2 bg-error/10 hover:bg-error hover:text-white text-error text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-error/20 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            <span>Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Metrics Bar (4 Key KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Check-in Turnout */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block font-semibold">
                Attendance & Turnout
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="font-headline font-extrabold text-2xl text-primary">
                  {turnout.checked_in?.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-medium">
                  / {turnout.total?.toLocaleString()} Checked in
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">how_to_reg</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-on-surface">{turnout.percentage}% Turnout</span>
              <span className="font-mono font-bold text-primary">{turnout.trend || "+8.4% vs T-12h"}</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, turnout.percentage)}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-on-surface-variant text-[11px] font-mono">
              <span className="material-symbols-outlined text-xs text-primary">speed</span>
              <span>{turnout.throughput || "QR throughput: ~38 scans/min avg"}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Teams & Repositories */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block font-semibold">
                Teams & Repositories
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="font-headline font-extrabold text-2xl text-on-surface">
                  {teams.active}
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-medium">
                  Active Teams
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-xl">lan</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-on-surface">{teams.synchronized_repos} Repos Synced</span>
              <span className="font-mono text-xs text-on-surface-variant">{teams.sync_percentage}%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${teams.sync_percentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-on-surface-variant">{teams.missing_first_commit} Missing first commit</span>
              <span className="text-secondary font-bold">Action Needed</span>
            </div>
          </div>
        </div>

        {/* Card 3: Volunteer & Mentor Fleet */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block font-semibold">
                Staff & Mentorship
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="font-headline font-extrabold text-2xl text-on-surface">
                  {staff.volunteers_on_duty}
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-medium">
                  Volunteers on Duty
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">support_agent</span>
            </div>
          </div>

          <div className="mt-4 bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                Active Dispatches
              </span>
              <span className="text-xs font-bold text-on-surface">
                {staff.active_dispatches} Mentors in field
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                Response Velocity
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {staff.avg_response_velocity}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Hardware & Compute Allocation */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block font-semibold">
                Compute & Gear Reserves
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="font-headline font-extrabold text-2xl text-primary">
                  {compute.jetson_kits_allocated}
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-medium">
                  / {compute.jetson_kits_total} Jetson Kits
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">developer_board</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-on-surface">Jetson Orin AGX Checkouts</span>
              <span className="font-mono font-bold text-secondary">{compute.kits_remaining} Kits Left</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${(compute.jetson_kits_allocated / compute.jetson_kits_total) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-on-surface-variant">Cloud: {compute.cloud_compute_allocated} Activated</span>
              <span className="text-primary font-bold">AWS / Lambda Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Operations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Timeline & Integrity Telemetry (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Section A: Event Run-of-Show Timeline */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                <h2 className="font-headline font-bold text-base text-on-surface">Event Run-of-Show</h2>
              </div>
              <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Live Flow
              </span>
            </div>

            <div className="flex flex-col gap-4 relative pl-4">
              <div className="absolute left-1.5 top-2 bottom-4 w-0.5 bg-surface-container-highest"></div>

              {timeline.map((item, idx) => {
                const isRunning = item.status === "RUNNING NOW";
                const isDone = item.status === "COMPLETED";

                return (
                  <div key={item.id || idx} className="relative flex items-start gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full -ml-[23px] mt-1 flex items-center justify-center ${
                        isRunning
                          ? 'bg-primary shadow-sm'
                          : isDone
                          ? 'bg-surface-container-highest'
                          : 'bg-surface-container-highest'
                      }`}
                    >
                      {isRunning ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      ) : isDone ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      )}
                    </div>

                    <div
                      className={`flex flex-col flex-1 p-3.5 rounded-xl border transition-all ${
                        isRunning
                          ? 'bg-surface-container-lowest border-primary/30 shadow-sm'
                          : 'bg-surface-container-low border-surface-container-high opacity-85'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-on-surface-variant font-semibold">
                          {item.time}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            isRunning
                              ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                              : isDone
                              ? 'bg-surface-container text-outline'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <span className="font-semibold text-sm text-on-surface leading-tight">
                        {item.title}
                      </span>

                      {item.speaker && (
                        <span className="text-xs text-primary font-medium mt-1">
                          Speaker: {item.speaker}
                        </span>
                      )}

                      {item.location && (
                        <span className="text-xs text-on-surface-variant mt-0.5">
                          {item.location}
                        </span>
                      )}

                      {item.attendees && (
                        <div className="mt-2 pt-2 border-t border-surface-container flex items-center justify-between text-xs font-mono text-primary">
                          <span>{item.elapsed || "Elapsed: 34m"}</span>
                          <span className="flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-xs">group</span>
                            {item.attendees}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section D: Automated Code & Integrity Telemetry */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">security</span>
                <h2 className="font-headline font-bold text-base text-on-surface">Code & Integrity Telemetry</h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">hub</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">
                      {telemetry.github_sync?.name || "GitHub Enterprise Webhook Sync"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      Push events processed: {telemetry.github_sync?.push_events?.toLocaleString() || "2,491"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  {telemetry.github_sync?.status || "STABLE"}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">policy</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">
                      {telemetry.ast_scanner?.name || "AST Plagiarism & Origin Scanner"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Pre-existing open source base check
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-surface-container text-primary px-2 py-0.5 rounded font-bold">
                  {telemetry.ast_scanner?.status || "0 FLAGS DETECTED"}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">deployed_code</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">
                      {telemetry.docker_runners?.name || "Docker Build Runners (AWS ECS)"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {telemetry.docker_runners?.healthy_workers || "32/32 worker instances healthy"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-primary">
                  {telemetry.docker_runners?.status || "100% PASS"}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-surface-container rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">memory</span>
                <span>
                  CPU: {telemetry.cluster_metrics?.cpu_utilization || "41.2%"} · RAM: {telemetry.cluster_metrics?.ram_usage || "64.8GB / 128GB"}
                </span>
              </div>
              <span className="text-primary font-bold">Cluster Live</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Check-in & Mentor Dispatch Queue (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Section B: Live QR Check-in & Station Throughput */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
                  <h2 className="font-headline font-bold text-base text-on-surface">
                    Live Check-in & Gear Distribution Node
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Real-time NFC/QR credentials validation across 4 building access gateways.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-on-surface-variant uppercase">Gate Status:</span>
                <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  4 Active Gates
                </span>
              </div>
            </div>

            {/* Checkin Search Input & Manual Scan Button */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <div className="sm:col-span-8 relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search by participant name, university email, team, or UUID badge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="sm:col-span-4">
                <button
                  onClick={onCheckinClick}
                  className="w-full h-10 bg-primary-container hover:bg-primary text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">barcode_reader</span>
                  <span>Fast Manual Scan</span>
                </button>
              </div>
            </div>

            {/* Live Attendee Feed Table */}
            <div className="overflow-x-auto rounded-xl border border-surface-container-high">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low font-mono text-[11px] text-on-surface-variant uppercase border-b border-surface-container-high">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Attendee</th>
                    <th className="py-2.5 px-3">Affiliation / Team</th>
                    <th className="py-2.5 px-3">Checkpoint / Event</th>
                    <th className="py-2.5 px-3 text-right">Badge UUID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {filteredCheckins.slice(0, 8).map((chk) => (
                    <tr key={chk.id} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">
                        {chk.time}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-on-surface">
                        {chk.attendee}
                      </td>
                      <td className="py-2.5 px-3 text-on-surface-variant">
                        {chk.affiliation}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                            chk.type === 'hardware'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {chk.type === 'hardware' ? 'memory' : 'door_front'}
                          </span>
                          {chk.checkpoint}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-outline">
                        {chk.badge_uuid}
                      </td>
                    </tr>
                  ))}
                  {filteredCheckins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-outline">
                        No check-in entries found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Mentor & Help Queue Dispatch Console */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">psychology</span>
                  <h2 className="font-headline font-bold text-base text-on-surface">
                    Mentor & Help Queue Dispatch Console
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Real-time technical assistance tickets submitted by participating engineering teams.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-medium">
                  {mentorQueue.filter(m => m.status === 'Queued').length} Queued
                </span>
                <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  14 Resolved This Hour
                </span>
              </div>
            </div>

            {/* Help Queue Table */}
            <div className="overflow-x-auto rounded-xl border border-surface-container-high">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low font-mono text-[11px] text-on-surface-variant uppercase border-b border-surface-container-high">
                    <th className="py-2.5 px-3">Team & Location</th>
                    <th className="py-2.5 px-3">Category & Issue</th>
                    <th className="py-2.5 px-3">Urgency</th>
                    <th className="py-2.5 px-3">Wait Time</th>
                    <th className="py-2.5 px-3">Mentor Assigned</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {mentorQueue.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-on-surface block leading-tight">
                          {ticket.team}
                        </span>
                        <span className="font-mono text-[10px] text-outline">
                          {ticket.location}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-primary font-semibold block">
                          {ticket.category}
                        </span>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1 max-w-xs">
                          {ticket.issue}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            ticket.urgency === 'Urgent'
                              ? 'bg-error/15 text-error animate-pulse'
                              : ticket.urgency === 'High'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {ticket.urgency}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-outline">
                        {ticket.wait_time}
                      </td>

                      <td className="py-3 px-3">
                        {ticket.assigned_mentor !== "Unassigned" ? (
                          <div className="flex items-center gap-1.5 text-primary font-semibold">
                            <span className="material-symbols-outlined text-xs">person</span>
                            <span>{ticket.assigned_mentor}</span>
                          </div>
                        ) : (
                          <span className="text-outline font-mono italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {ticket.status === 'Queued' ? (
                          <button
                            onClick={() => onDispatchMentor && onDispatchMentor(ticket.id, "Dr. Sarah Lin")}
                            className="bg-primary hover:bg-primary-container text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                          >
                            Dispatch Mentor
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                            {ticket.status}
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

