import React, { useState, useEffect } from 'react';

export default function WarRoom({
  data,
  onAddTaskClick,
  onMoveTask,
  onSendMessage,
  onInviteClick
}) {
  const [countdown, setCountdown] = useState({ hours: 18, minutes: 42, seconds: 10 });
  const [chatInput, setChatInput] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [checklist, setChecklist] = useState([
    { id: 'chk-1', text: 'Calibrated LiDAR Extrinsics & Transform URDF', checked: true },
    { id: 'chk-2', text: 'Multi-Drone Peer-to-Peer Heartbeat Protocol', checked: true },
    { id: 'chk-3', text: 'TensorRT FP16 Engine Calibration & Benchmark', checked: false },
    { id: 'chk-4', text: 'Autonomous Trajectory Replay in Zero-Lux', checked: false },
  ]);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kanban = data?.kanban || { backlog: [], in_progress: [], under_review: [], deployed: [] };
  const missionLog = data?.mission_log || [];
  const telemetry = data?.orin_telemetry || {};

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage && onSendMessage(chatInput);
    setChatInput('');
  };

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="flex flex-col w-full pb-16 animate-fadeIn">
      {/* Team Header Banner: Editorial Architectural Ledger Style */}
      <section className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-6 mb-6 border border-surface-container-high flex flex-col gap-4">
        {/* Top Metadata Ledger */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {data?.track || "TRACK 04 // SWARM INTELLIGENCE"}
              </span>
              <span className="font-mono text-xs text-outline">
                WORKSPACE ID: {data?.workspace_id || "VS-9920-ALPHA"}
              </span>
              <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                {data?.status || "BENCH VERIFIED"}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap mt-1">
              <h1 className="font-headline font-extrabold text-2xl lg:text-3xl text-primary tracking-tight">
                {data?.team_name || "Team VectorSwarm"}
              </h1>
              <span className="text-xs text-on-surface-variant font-medium">
                {data?.tagline || "Autonomous Robotics & Swarm Navigation Pipeline"}
              </span>
            </div>
          </div>

          {/* Realtime Sprint Clock Module */}
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high self-start lg:self-auto">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Sprint Phase Countdown
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                <span className="font-mono text-base text-primary font-bold tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-surface-container-highest"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Evaluation Wave
              </span>
              <span className="font-mono text-xs text-secondary font-bold">
                {data?.evaluation_wave || "WAVE 03 // 22:00 UTC"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Divider */}
        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Operational Strip: Personnel & Repository Status */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Team Personnel Manifest */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold sm:w-28 shrink-0">
              Unit Roster ({data?.members?.length || 4}/5)
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {data?.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container px-2.5 py-1.5 rounded-xl border border-surface-container-high transition-colors"
                >
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-2 ring-white"></span>
                  </div>
                  <div className="flex flex-col pr-1">
                    <span className="text-xs font-semibold text-on-surface leading-tight">
                      {member.short_name || member.name}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant leading-none">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={onInviteClick}
                className="flex items-center gap-1.5 bg-surface-container hover:bg-primary hover:text-white text-primary px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border border-surface-container-high transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>+ Invite Teammate</span>
              </button>
            </div>
          </div>

          {/* Git / CI Pipeline Capsule */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high overflow-x-auto text-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-base">terminal</span>
            <a
              href={data?.repository?.url || "https://github.com"}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-primary font-bold hover:underline"
            >
              github.com/aegis-sprint/vectorswarm-nav
            </a>
            <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-0.5 rounded font-mono text-[11px] text-on-surface font-semibold">
              <span className="material-symbols-outlined text-xs">alt_route</span>
              <span>main</span>
            </div>
            <span className="font-mono text-outline font-semibold">#8f2a1b</span>
            <span className="inline-flex items-center gap-1 bg-primary text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
              <span>CI Passing (3m ago)</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3-Column Tactical Command Canvas */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: Sprint Kanban Board & Hardware Telemetry (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-container-high flex flex-col gap-4">
            {/* Kanban Header */}
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">view_kanban</span>
                <h2 className="font-headline font-bold text-base text-primary">Sprint Workstream</h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                  10 Tasks
                </span>
                <button
                  onClick={onAddTaskClick}
                  className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                  title="Add Task"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                </button>
              </div>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Backlog */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Backlog
                  </span>
                  <span className="font-mono text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-semibold">
                    {kanban.backlog?.length || 0}
                  </span>
                </div>
                {kanban.backlog?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'backlog', 'in_progress')}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:border-primary/40 border border-surface-container-high cursor-pointer transition-all hover:shadow flex flex-col gap-1.5"
                    title="Click to move to In Progress"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                        {task.id}
                      </span>
                      <span className="font-mono text-[10px] bg-surface-container text-outline px-1.5 py-0.5 rounded">
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-on-surface leading-snug">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                      <span className="text-secondary font-medium">{task.project}</span>
                      <span className="text-on-surface-variant">{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* In Progress */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                    In Progress
                  </span>
                  <span className="font-mono text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">
                    {kanban.in_progress?.length || 0}
                  </span>
                </div>
                {kanban.in_progress?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'in_progress', 'under_review')}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:border-primary/40 border border-surface-container-high cursor-pointer transition-all hover:shadow flex flex-col gap-1.5"
                    title="Click to move to Under Review"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-mono text-[10px] bg-primary-fixed text-primary font-bold px-1.5 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          task.priority === 'URGENT'
                            ? 'bg-error/15 text-error animate-pulse'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-on-surface leading-snug">
                      {task.title}
                    </p>
                    <span className="font-mono text-[10px] text-secondary font-medium">
                      {task.project}
                    </span>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                      <span className="font-semibold text-on-surface">{task.assignee}</span>
                      {task.badge && (
                        <span className="text-secondary font-bold">{task.badge}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Under Review */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Under Review
                  </span>
                  <span className="font-mono text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-semibold">
                    {kanban.under_review?.length || 0}
                  </span>
                </div>
                {kanban.under_review?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'under_review', 'deployed')}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:border-primary/40 border border-surface-container-high cursor-pointer transition-all hover:shadow flex flex-col gap-1.5"
                    title="Click to move to Deployed"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-mono text-[10px] bg-surface-container text-primary font-bold px-1.5 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="font-mono text-[10px] bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-bold">
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-on-surface leading-snug">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                      <span className="text-on-surface font-semibold">{task.assignee}</span>
                      <span className="text-outline">{task.badge || "1 Approval Req"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployed / Done */}
              <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Deployed / Done
                  </span>
                  <span className="font-mono text-[10px] bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-bold">
                    {kanban.deployed?.length || 0}
                  </span>
                </div>
                {kanban.deployed?.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm border border-surface-container-high opacity-90 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-outline line-through">
                        {task.id} {task.title}
                      </span>
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    </div>
                    {task.note && (
                      <span className="font-mono text-[10px] text-on-surface-variant truncate">
                        {task.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Swarm Hardware Telemetry (Sparkline Data Viz) */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">memory</span>
                <span className="font-mono text-xs font-bold uppercase text-on-surface">
                  Orin Edge Compute Telemetry
                </span>
              </div>
              <span className="font-mono text-[11px] bg-primary-fixed/40 text-primary px-2.5 py-0.5 rounded-full font-bold">
                {telemetry.temperature || "39.4°C"} // {telemetry.status || "NOMINAL"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* NPU Load */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex flex-col">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                  NPU Load
                </span>
                <span className="font-headline font-bold text-lg text-primary mt-0.5">
                  {telemetry.npu_load || "84.2%"}
                </span>
                <svg className="w-full h-7 text-primary mt-1" fill="none" viewBox="0 0 100 24">
                  <path
                    d="M0 18 L15 14 L30 19 L45 8 L60 11 L75 4 L90 7 L100 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* VRAM Alloc */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex flex-col">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                  VRAM Alloc
                </span>
                <span className="font-headline font-bold text-lg text-secondary mt-0.5">
                  {telemetry.vram_alloc || "6.8 / 8GB"}
                </span>
                <svg className="w-full h-7 text-secondary mt-1" fill="none" viewBox="0 0 100 24">
                  <path
                    d="M0 20 L20 18 L40 16 L60 12 L80 10 L100 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Sync Jitter */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high flex flex-col">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                  Sync Jitter
                </span>
                <span className="font-headline font-bold text-lg text-primary mt-0.5">
                  {telemetry.sync_jitter || "1.82 ms"}
                </span>
                <svg className="w-full h-7 text-primary mt-1" fill="none" viewBox="0 0 100 24">
                  <path
                    d="M0 10 L25 12 L50 8 L75 14 L100 11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Live War Room Channel & Collaboration Log (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-container-high flex flex-col gap-4">
            {/* Header with Audio Huddle Indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">forum</span>
                <h2 className="font-headline font-bold text-base text-primary">Mission Log</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-container-high">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="material-symbols-outlined text-xs text-primary">headphones</span>
                <span className="font-mono text-[10px] text-primary font-bold">Audio: 3 listening</span>
              </div>
            </div>

            {/* Pinned Architecture Directives & Decisions */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">push_pin</span>
                  Architecture ADR-004
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant">Ratified 1h ago</span>
              </div>
              <p className="text-xs text-on-surface font-medium leading-relaxed">
                Decided: Fallback from centralized coordinator to peer-to-peer relative consensus over CycloneDDS if RSSI drops below -82dBm. No master node single point of failure.
              </p>
            </div>

            {/* Live Activity Stream */}
            <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto pr-1">
              {missionLog.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {msg.avatar ? (
                        <img
                          src={msg.avatar}
                          alt={msg.author}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-surface-container-high"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-base">
                          {msg.icon || 'smart_toy'}
                        </span>
                      )}
                      <span className="font-bold text-on-surface">{msg.author}</span>
                      <span className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.2 rounded font-semibold">
                        {msg.role}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-outline">{msg.time}</span>
                  </div>

                  <p className="text-on-surface leading-relaxed pl-7">{msg.text}</p>

                  {/* Optional Code Snippet Component */}
                  {msg.code_snippet && (
                    <div className="ml-7 bg-surface-container-highest rounded-xl p-3 font-mono text-[11px] text-on-surface border border-surface-container-high flex flex-col gap-1 overflow-x-auto">
                      <div className="flex items-center justify-between text-on-surface-variant pb-1 border-b border-surface-container text-[10px]">
                        <span>{msg.code_snippet.filename}</span>
                        <span className="uppercase font-bold">{msg.code_snippet.lang}</span>
                      </div>
                      <pre className="text-primary font-mono text-xs whitespace-pre-wrap leading-tight mt-1">
                        <code>{msg.code_snippet.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat & Prompt Dispatch Input */}
            <form onSubmit={handleSendChat} className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Post telemetry note or @AEGIS Synthesizer prompt..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface text-xs rounded-xl px-3 py-2.5 pr-10 border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-primary hover:text-primary-container p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant px-1">
                <span>Tip: Ask @AEGIS Synthesizer for instant ROS2 advice</span>
                <span className="text-primary font-semibold">Active Session</span>
              </div>
            </form>
          </div>
        </div>

        {/* COLUMN 3: AI Mentor Agent ("AEGIS Synthesizer") & Deliverables Checklist (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* AI Mentor Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-lg">smart_toy</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-sm text-primary leading-tight">
                    AEGIS Synthesizer
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    Sprint Autonomous AI Copilot
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                ONLINE
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-high flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-secondary font-mono text-[10px] font-bold uppercase">
                <span className="material-symbols-outlined text-xs">psychology</span>
                Active Technical Advisory
              </div>
              <p className="text-on-surface leading-snug">
                Swarm formation UDP latency SLA is currently healthy at 1.82ms. Ensure dynamic obstacle rejection is tested before 16:30 Milestone 2 Freeze.
              </p>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <span className="font-headline font-bold text-sm text-on-surface">
                Sprint Deliverables Checklist
              </span>
              <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                {checklist.filter(c => c.checked).length} of {checklist.length} Done
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-2.5 text-xs cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4 accent-primary"
                  />
                  <span className={item.checked ? 'line-through text-outline' : 'text-on-surface font-medium'}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

