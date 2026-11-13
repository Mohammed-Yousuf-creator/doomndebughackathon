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
  const [checklist, setChecklist] = useState([
    { id: 'chk-1', text: 'Calibrate LiDAR Extrinsics & Transform URDF', checked: true },
    { id: 'chk-2', text: 'Peer-to-Peer Heartbeat Protocol over CycloneDDS', checked: true },
    { id: 'chk-3', text: 'TensorRT FP16 Engine Calibration on Orin Nano', checked: false },
    { id: 'chk-4', text: 'Autonomous Trajectory Replay in Zero-Lux Corridor', checked: false },
  ]);

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
    <div className="flex flex-col w-full pb-12">
      {/* Team Header Banner */}
      <section className="w-full bg-white rounded-xl p-5 mb-5 border border-[#E7DFD5] shadow-card flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] text-[#C2542D] font-semibold bg-[#FBEFEA] px-2 py-0.5 rounded border border-[#F6DDD3]">
                Track 04: Swarm Intelligence & Autonomous Robotics
              </span>
              <span className="text-[#A89C92] text-xs">•</span>
              <span className="font-mono text-xs text-[#73645A]">Table 4B • Stata Lab</span>
              <span className="text-[#A89C92] text-xs">•</span>
              <span className="font-mono text-[11px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.5 rounded">
                Bench Verified
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-[#1F1916]">
                Team VectorSwarm
              </h1>
              <span className="text-xs text-[#73645A]">
                Multi-Rover LiDAR SLAM & Decentralized State Estimation
              </span>
            </div>
          </div>

          {/* Countdown & Next Wave */}
          <div className="flex items-center gap-4 bg-[#FAF7F2] px-4 py-2 rounded-xl border border-[#E7DFD5] self-start lg:self-auto">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#73645A] uppercase tracking-wider">
                Submission Freeze In
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2542D] animate-ping"></span>
                <span className="font-mono text-sm text-[#1F1916] font-bold tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="w-px h-7 bg-[#E7DFD5]"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#73645A] uppercase tracking-wider">
                Evaluation Wave
              </span>
              <span className="font-mono text-xs text-[#2F5B3C] font-bold mt-0.5">
                Wave 03 (22:00 UTC)
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#F0EAE1]"></div>

        {/* Roster & Git Capsule */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
          {/* Members */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#73645A] font-medium mr-1">Roster (4/5):</span>
            {data?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E7DFD5]"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-[#E5DDD2] text-[#1F1916] flex items-center justify-center text-[9px] font-bold font-mono">
                    {member.name ? member.name[0].toUpperCase() : 'M'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-[#2F5B3C] ring-1 ring-white"></span>
                </div>
                <span className="font-semibold text-[#1F1916] text-[11px]">{member.short_name || member.name}</span>
                <span className="text-[10px] text-[#73645A]">{member.role}</span>
              </div>
            ))}

            <button
              onClick={onInviteClick}
              className="flex items-center gap-1 bg-white hover:bg-[#FAF7F2] text-[#C2542D] px-2.5 py-1 rounded-lg font-medium border border-[#E7DFD5] transition-colors cursor-pointer text-[11px]"
            >
              <span className="material-symbols-outlined text-[13px]">add</span>
              <span>Invite</span>
            </button>
          </div>

          {/* Repo status */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1 rounded-lg border border-[#E7DFD5] font-mono text-[11px] text-[#73645A]">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span className="text-[#1F1916] font-semibold">vectorswarm-nav</span>
            <span>:main</span>
            <span>(#8f2a1b)</span>
            <span className="inline-flex items-center gap-1 text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.2 rounded ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C]"></span>
              CI Pass (3m ago)
            </span>
          </div>
        </div>
      </section>

      {/* 3-Column Tactical Workspace */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMN 1: Kanban Board & Hardware Telemetry (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#73645A]">view_kanban</span>
                <h2 className="font-sans font-bold text-sm text-[#1F1916]">Sprint Kanban</h2>
              </div>
              <button
                onClick={onAddTaskClick}
                className="flex items-center gap-1 bg-[#2F5B3C] hover:bg-[#254B31] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>New Task</span>
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Backlog */}
              <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E7DFD5] flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#73645A] uppercase px-1">
                  <span>Backlog</span>
                  <span className="bg-[#EBE3DA] px-1.5 py-0.2 rounded font-semibold text-[#1F1916]">
                    {kanban.backlog?.length || 0}
                  </span>
                </div>
                {kanban.backlog?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'backlog', 'in_progress')}
                    className="bg-white rounded-md p-2 border border-[#E7DFD5] shadow-subtle hover:border-[#C2542D] cursor-pointer transition-colors flex flex-col gap-1"
                    title="Move to In Progress"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#C2542D] font-bold">{task.id}</span>
                      <span className="text-[#73645A]">{task.priority}</span>
                    </div>
                    <p className="font-semibold text-xs text-[#1F1916] leading-snug">{task.title}</p>
                    <div className="flex justify-between text-[10px] text-[#73645A] font-mono mt-0.5">
                      <span>{task.project}</span>
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* In Progress */}
              <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E7DFD5] flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#2F5B3C] uppercase px-1 font-semibold">
                  <span>In Progress</span>
                  <span className="bg-[#2F5B3C] text-white px-1.5 py-0.2 rounded font-semibold">
                    {kanban.in_progress?.length || 0}
                  </span>
                </div>
                {kanban.in_progress?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'in_progress', 'under_review')}
                    className="bg-white rounded-md p-2 border border-[#E7DFD5] shadow-subtle hover:border-[#2F5B3C] cursor-pointer transition-colors flex flex-col gap-1"
                    title="Move to Under Review"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#2F5B3C] font-bold">{task.id}</span>
                      <span className={`px-1 py-0.2 rounded font-semibold ${task.priority === 'URGENT' ? 'bg-[#FDF2F2] text-[#B83A3A]' : 'text-[#73645A]'}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="font-semibold text-xs text-[#1F1916] leading-snug">{task.title}</p>
                    <div className="flex justify-between text-[10px] text-[#73645A] font-mono mt-0.5">
                      <span>{task.assignee}</span>
                      {task.badge && <span className="text-[#C2542D] font-semibold">{task.badge}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Under Review */}
              <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E7DFD5] flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#73645A] uppercase px-1">
                  <span>Under Review</span>
                  <span className="bg-[#EBE3DA] px-1.5 py-0.2 rounded font-semibold text-[#1F1916]">
                    {kanban.under_review?.length || 0}
                  </span>
                </div>
                {kanban.under_review?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onMoveTask && onMoveTask(task.id, 'under_review', 'deployed')}
                    className="bg-white rounded-md p-2 border border-[#E7DFD5] shadow-subtle hover:border-[#2F5B3C] cursor-pointer transition-colors flex flex-col gap-1"
                    title="Move to Deployed"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#2F5B3C] font-bold">{task.id}</span>
                      <span className="text-[#2F5B3C] bg-[#EFF5F1] px-1 rounded">{task.priority}</span>
                    </div>
                    <p className="font-semibold text-xs text-[#1F1916] leading-snug">{task.title}</p>
                    <div className="flex justify-between text-[10px] text-[#73645A] font-mono mt-0.5">
                      <span>{task.assignee}</span>
                      <span>{task.badge || "PR Ready"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployed */}
              <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E7DFD5] flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#73645A] uppercase px-1">
                  <span>Deployed</span>
                  <span className="bg-[#EFF5F1] text-[#2F5B3C] px-1.5 py-0.2 rounded font-semibold">
                    {kanban.deployed?.length || 0}
                  </span>
                </div>
                {kanban.deployed?.map((task) => (
                  <div key={task.id} className="bg-white rounded-md p-2 border border-[#E7DFD5] opacity-80 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#73645A] line-through">{task.id}</span>
                      <span className="material-symbols-outlined text-[#2F5B3C] text-[13px]">check_circle</span>
                    </div>
                    <p className="text-xs text-[#73645A] leading-snug">{task.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Edge Telemetry */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F1916]">
                <span className="material-symbols-outlined text-[16px] text-[#2F5B3C]">memory</span>
                <span>Jetson Orin Edge Compute Telemetry</span>
              </div>
              <span className="font-mono text-[10px] text-[#2F5B3C] bg-[#EFF5F1] px-2 py-0.5 rounded font-bold">
                {telemetry.temperature || "39.4°C"} // NOMINAL
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">NPU Load</span>
                <span className="font-sans font-bold text-base text-[#2F5B3C]">{telemetry.npu_load || "84.2%"}</span>
                <svg className="w-full h-5 text-[#2F5B3C] mt-0.5" fill="none" viewBox="0 0 100 24">
                  <path d="M0 18 L15 14 L30 19 L45 8 L60 11 L75 4 L90 7 L100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">VRAM</span>
                <span className="font-sans font-bold text-base text-[#C2542D]">{telemetry.vram_alloc || "6.8 / 8GB"}</span>
                <svg className="w-full h-5 text-[#C2542D] mt-0.5" fill="none" viewBox="0 0 100 24">
                  <path d="M0 20 L20 18 L40 16 L60 12 L80 10 L100 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">Sync Jitter</span>
                <span className="font-sans font-bold text-base text-[#2F5B3C]">{telemetry.sync_jitter || "1.82 ms"}</span>
                <svg className="w-full h-5 text-[#2F5B3C] mt-0.5" fill="none" viewBox="0 0 100 24">
                  <path d="M0 10 L25 12 L50 8 L75 14 L100 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Mission Log & Collaboration Stream (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#73645A]">chat</span>
                <h2 className="font-sans font-bold text-sm text-[#1F1916]">Team Log & Huddle</h2>
              </div>
              <span className="text-[11px] text-[#2F5B3C] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C] animate-pulse"></span>
                Audio: 3 listening
              </span>
            </div>

            {/* Pinned Consensus */}
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-xs">
              <span className="font-mono text-[10px] text-[#C2542D] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">push_pin</span>
                Consensus ADR-004
              </span>
              <p className="text-[11px] text-[#1F1916] mt-0.5 leading-snug">
                Fallback to P2P relative consensus over CycloneDDS if RSSI &lt; -82dBm. No single point of failure.
              </p>
            </div>

            {/* Message Feed */}
            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {missionLog.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#2F5B3C]">{msg.icon || 'smart_toy'}</span>
                      <span className="font-semibold text-[#1F1916] text-[11px]">{msg.author}</span>
                      <span className="text-[10px] text-[#73645A]">({msg.role})</span>
                    </div>
                    <span className="text-[10px] text-[#A89C92] font-mono">{msg.time}</span>
                  </div>

                  <p className="text-[#382F2A] text-[11px] pl-5 leading-relaxed">{msg.text}</p>

                  {msg.code_snippet && (
                    <div className="ml-5 bg-[#FAF7F2] rounded-md p-2 font-mono text-[10px] border border-[#E7DFD5] overflow-x-auto">
                      <div className="text-[#73645A] pb-1 border-b border-[#E7DFD5] flex justify-between">
                        <span>{msg.code_snippet.filename}</span>
                        <span>{msg.code_snippet.lang}</span>
                      </div>
                      <pre className="text-[#2F5B3C] pt-1 leading-tight">
                        <code>{msg.code_snippet.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex flex-col gap-1 pt-2 border-t border-[#F0EAE1]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Post message or ask @AI-Mentor..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-[#1F1916] text-xs rounded-lg px-3 py-2 pr-8 border border-[#E7DFD5] focus:outline-none focus:bg-white focus:border-[#C2542D] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-[#C2542D] hover:text-[#A8431F] p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
              <span className="text-[10px] text-[#A89C92] font-mono px-1">
                Tip: Type @AI-Mentor to critique your architecture
              </span>
            </form>
          </div>
        </div>

        {/* COLUMN 3: AI-Mentor Rubric Critic & Checklist (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* AI-Mentor Card */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#2F5B3C] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                </div>
                <span className="font-sans font-bold text-xs text-[#1F1916]">@AI-Mentor Critic</span>
              </div>
              <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-1.5 py-0.2 rounded">
                ACTIVE
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-xs">
              <span className="text-[10px] font-mono text-[#C47D1C] font-semibold block">
                Rubric Assessment (Estimated: 88/100)
              </span>
              <p className="text-[11px] text-[#382F2A] mt-1 leading-relaxed">
                Strong technical depth on pointcloud deskewing. Ensure dynamic obstacle rejection is demonstrated in the demo video to maximize Criterion 3 (Real-World Performance).
              </p>
            </div>
          </div>

          {/* Submission Checklist */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <span className="font-sans font-bold text-xs text-[#1F1916]">
                Deliverables Checklist
              </span>
              <span className="font-mono text-[10px] text-[#73645A]">
                {checklist.filter(c => c.checked).length} of {checklist.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-2 text-xs cursor-pointer p-1 rounded hover:bg-[#FAF7F2] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-[#2F5B3C] focus:ring-[#2F5B3C] h-3.5 w-3.5 accent-[#2F5B3C]"
                  />
                  <span className={item.checked ? 'line-through text-[#A89C92] text-[11px]' : 'text-[#1F1916] text-[11px] font-medium'}>
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
