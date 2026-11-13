import React, { useState, useEffect } from 'react';

export default function JudgeConsole({
  data,
  onSubmitEvaluation,
  onSaveDraft
}) {
  const [activeMediaTab, setActiveMediaTab] = useState('video');
  const [currentSlide, setCurrentSlide] = useState(4);
  const totalSlides = 10;
  const [copiedCommit, setCopiedCommit] = useState(false);

  const [scores, setScores] = useState({
    technical_rigor: 9,
    algorithmic_novelty: 8,
    edge_performance: 9,
    documentation: 8,
    track_alignment: 10
  });

  const [privateNotes, setPrivateNotes] = useState('');
  const [feedback, setFeedback] = useState(
    'Sub-15ms loop closure latency is exceptional on physical Orin units. The distributed pose graph fusion is very clean. Recommend clarifying dynamic obstacle rejection in degraded lighting.'
  );

  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-8824');
  const [showLogModal, setShowLogModal] = useState(false);

  const judgeProfile = data?.judge_profile || {
    name: 'Dr. Aris Thome',
    initials: 'AT',
    title: 'Head of Edge Computing, Boston Tech',
    track: 'Track 01: Multi-Agent Perception & Edge Robotics',
    completed_count: 4,
    total_quota: 12,
    remaining: 8
  };

  const submissions = data?.submissions || [];
  const currentProject = submissions.find(s => s.id === selectedProjectId) || submissions[0] || {};

  useEffect(() => {
    if (currentProject?.rubric) {
      setScores({
        technical_rigor: currentProject.rubric.technical_rigor?.score ?? 9,
        algorithmic_novelty: currentProject.rubric.algorithmic_novelty?.score ?? 8,
        edge_performance: currentProject.rubric.edge_performance?.score ?? 9,
        documentation: currentProject.rubric.documentation?.score ?? 8,
        track_alignment: currentProject.rubric.track_alignment?.score ?? 10
      });
      if (currentProject.participant_feedback) {
        setFeedback(currentProject.participant_feedback);
      }
    }
  }, [selectedProjectId]);

  const weights = {
    technical_rigor: 0.30,
    algorithmic_novelty: 0.25,
    edge_performance: 0.20,
    documentation: 0.15,
    track_alignment: 0.10
  };

  const compositeScore = Object.keys(weights).reduce((acc, key) => {
    return acc + (scores[key] * 10 * weights[key]);
  }, 0).toFixed(1);

  const handleCopyCommit = () => {
    navigator.clipboard?.writeText(currentProject?.verification?.commit || '#d9e14a');
    setCopiedCommit(true);
    setTimeout(() => setCopiedCommit(false), 2000);
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-12 border border-[#E7DFD5] text-center shadow-card space-y-4 my-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EFF5F1] text-[#2F5B3C] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">gavel</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#1F1916]">Judging & Rubric Evaluation Console</h3>
        <p className="text-xs text-[#73645A] max-w-md mx-auto leading-relaxed">
          No participant projects have been submitted for this opportunity yet. Once participants submit their repositories via the Participant Portal, their automated rubrics, live demos, and pitch decks will appear here for grading.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Juror Control Bar */}
      <div className="w-full bg-white rounded-xl p-4 mb-5 border border-[#E7DFD5] shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2F5B3C] text-white flex items-center justify-center font-bold text-sm">
              {judgeProfile.initials || "AT"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#1F1916]">
                  {judgeProfile.name}
                </span>
                <span className="text-[11px] text-[#73645A] font-medium">
                  ({judgeProfile.title})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#73645A] mt-0.5">
                <span className="text-[#2F5B3C] font-medium">{judgeProfile.track}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-[#C47D1C]">Double-Blind Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Progress */}
            <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E7DFD5] text-xs">
              <div className="flex justify-between items-center gap-4 text-[11px] font-mono mb-1">
                <span className="text-[#73645A]">Evaluation Quota</span>
                <span className="font-bold text-[#2F5B3C]">
                  {judgeProfile.completed_count} of {judgeProfile.total_quota} Projects
                </span>
              </div>
              <div className="w-40 bg-[#E7DFD5] h-1.5 rounded-md overflow-hidden">
                <div
                  className="bg-[#2F5B3C] h-full rounded-md transition-all duration-300"
                  style={{ width: `${(judgeProfile.completed_count / judgeProfile.total_quota) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Project Switcher */}
            {submissions.length > 1 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-white text-xs font-mono font-medium text-[#1F1916] px-2.5 py-2 rounded-lg border border-[#E7DFD5] shadow-subtle cursor-pointer focus:outline-none"
              >
                {submissions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.title.substring(0, 30)}...
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Submission Inspector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white rounded-xl p-5 border border-[#E7DFD5] shadow-card">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-[#73645A] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E7DFD5]">
                    #{currentProject.id}
                  </span>
                  <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold bg-[#EFF5F1] px-2 py-0.5 rounded">
                    Hardware Bench Validated
                  </span>
                </div>
                <h1 className="font-serif text-2xl font-medium tracking-tight text-[#1F1916]">
                  {currentProject.title}
                </h1>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#73645A] block uppercase font-mono">Category</span>
                <span className="text-xs font-medium text-[#2F5B3C]">{currentProject.category}</span>
              </div>
            </div>

            <p className="text-xs text-[#73645A] leading-relaxed bg-[#FAF7F2] p-3 rounded-lg border border-[#E7DFD5] mt-2 mb-4">
              {currentProject.description}
            </p>

            {/* Media Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-lg mb-3 border border-[#E7DFD5] text-xs">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`flex-1 py-1.5 px-2.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeMediaTab === 'video' ? 'bg-white text-[#1F1916] font-semibold shadow-subtle' : 'text-[#73645A] hover:text-[#1F1916]'
                }`}
              >
                Video Demo
              </button>
              <button
                onClick={() => setActiveMediaTab('deck')}
                className={`flex-1 py-1.5 px-2.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeMediaTab === 'deck' ? 'bg-white text-[#1F1916] font-semibold shadow-subtle' : 'text-[#73645A] hover:text-[#1F1916]'
                }`}
              >
                Pitch Deck ({totalSlides})
              </button>
              <button
                onClick={() => setActiveMediaTab('arch')}
                className={`flex-1 py-1.5 px-2.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeMediaTab === 'arch' ? 'bg-white text-[#1F1916] font-semibold shadow-subtle' : 'text-[#73645A] hover:text-[#1F1916]'
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveMediaTab('audit')}
                className={`flex-1 py-1.5 px-2.5 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeMediaTab === 'audit' ? 'bg-white text-[#2F5B3C] font-semibold shadow-subtle' : 'text-[#73645A] hover:text-[#1F1916]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px] text-[#2F5B3C]">history_toggle_off</span>
                <span>Git Time-Machine</span>
              </button>
            </div>

            {/* Tab 1: Video Player */}
            {activeMediaTab === 'video' && (
              <div className="flex flex-col gap-1.5">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#12100E] border border-[#2B231D] shadow-subtle group flex items-center justify-center">
                  {/* Subtle vector grid and play icon */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1916_1px,transparent_1px),linear-gradient(to_bottom,#1f1916_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer shadow-lg">
                      <span className="material-symbols-outlined text-2xl ml-0.5">play_arrow</span>
                    </div>
                    <span className="text-white/80 font-mono text-xs">Live System Validation Stream</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 p-3.5 flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between text-white text-xs font-mono">
                      <span className="bg-black/70 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1.5 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#C2542D] animate-pulse"></span>
                        4K / 60 FPS Telemetry
                      </span>
                      <span className="text-[11px] font-mono text-white/70">03:42 / 05:00</span>
                    </div>

                    <div className="flex flex-col gap-1.5 pointer-events-auto">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white">
                        <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">01:15 Live Hardware Test</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">03:20 Edge Latency Benchmark</span>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-md relative overflow-hidden">
                        <div className="bg-[#82E6A1] h-full rounded-md w-3/4"></div>
                      </div>
                      <div className="flex items-center justify-between text-white text-xs pt-0.5">
                        <span className="font-mono text-[10px] text-white/80">Jetson Orin: 48°C • 11.4ms EKF Estimation</span>
                        <span className="material-symbols-outlined text-sm text-white/80 cursor-pointer">fullscreen</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-[#73645A] font-mono px-0.5">
                  <span>{currentProject.caption}</span>
                  <span>Dataset: {currentProject.dataset}</span>
                </div>
              </div>
            )}

            {/* Tab 2: Deck Viewer */}
            {activeMediaTab === 'deck' && (
              <div className="flex flex-col gap-2">
                <div className="relative w-full aspect-[16/9] rounded-xl bg-white border border-[#E7DFD5] p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                    <span className="text-xs font-mono font-semibold text-[#24422D] bg-[#EFF5F1] px-2.5 py-1 rounded-lg border border-[#DEEBE1]">
                      Slide {currentSlide} of {totalSlides} • Pitch Deck
                    </span>
                    <span className="text-xs text-[#73645A] font-mono">Distributed SLAM Protocol</span>
                  </div>

                  <div className="my-auto py-3 space-y-2">
                    <h3 className="font-serif text-lg font-semibold text-[#1F1916]">
                      {currentSlide === 1 && "Autonomous Multi-Agent Loop Closure"}
                      {currentSlide === 2 && "Edge Latency & Network Resilience Benchmarks"}
                      {currentSlide >= 3 && "Commercial Deployment & Hardware Verification"}
                    </h3>
                    <p className="text-xs text-[#73645A] leading-relaxed">
                      Real-time peer-to-peer state synchronisation operating over bandwidth-constrained mesh radios with deterministic sub-15ms loop closure guarantees.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE1]">
                    <button
                      onClick={() => setCurrentSlide(s => Math.max(1, s - 1))}
                      disabled={currentSlide === 1}
                      className="bg-[#FAF7F2] hover:bg-[#F0EBE1] text-xs px-3 py-1.5 rounded-lg border border-[#E7DFD5] disabled:opacity-40 font-medium cursor-pointer transition-colors"
                    >
                      ← Previous Slide
                    </button>
                    <span className="text-[11px] font-mono text-[#73645A]">
                      Use arrow keys or buttons to navigate
                    </span>
                    <button
                      onClick={() => setCurrentSlide(s => Math.min(totalSlides, s + 1))}
                      disabled={currentSlide === totalSlides}
                      className="bg-[#FAF7F2] hover:bg-[#F0EBE1] text-xs px-3 py-1.5 rounded-lg border border-[#E7DFD5] disabled:opacity-40 font-medium cursor-pointer transition-colors"
                    >
                      Next Slide →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Architecture */}
            {activeMediaTab === 'arch' && (
              <div className="flex flex-col gap-3">
                <div className="w-full aspect-[16/9] rounded-xl bg-white p-5 border border-[#E7DFD5] flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2.5">
                    <span className="text-xs font-mono font-semibold text-[#1F1916]">System Pipeline Architecture</span>
                    <span className="text-[10px] font-mono bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded border border-[#DEEBE1]">Live Validated</span>
                  </div>

                  {/* Native Node Diagram */}
                  <div className="grid grid-cols-4 gap-2 my-auto items-center">
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">Ingest</span>
                      <span className="text-xs font-semibold text-[#1F1916] mt-0.5 block">LiDAR & Stereo</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EFF5F1] border border-[#DEEBE1] text-center">
                      <span className="text-[10px] font-mono text-[#2F5B3C] uppercase block">Compute Core</span>
                      <span className="text-xs font-semibold text-[#1F1916] mt-0.5 block">Jetson Orin</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">Estimation</span>
                      <span className="text-xs font-semibold text-[#1F1916] mt-0.5 block">EKF Filter</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">Sync</span>
                      <span className="text-xs font-semibold text-[#1F1916] mt-0.5 block">Mesh Protocol</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#73645A] bg-[#FAF7F2] p-2 rounded-lg border border-[#F0EAE1] flex justify-between">
                    <span>Target Latency: &lt;15ms</span>
                    <span>Throughput: 120 FPS</span>
                    <span>Packet Loss: 0.02%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {currentProject.tech_stack?.map((t, idx) => (
                    <div key={idx} className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5]">
                      <span className="text-[10px] text-[#73645A] font-mono block uppercase">{t.label}</span>
                      <span className="font-semibold text-[#1F1916] mt-0.5 block">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: AI Git Time-Machine & Proof-of-Fresh-Code */}
            {activeMediaTab === 'audit' && (
              <div className="flex flex-col gap-3">
                {/* Score & Verdict Card */}
                <div className="p-4 rounded-xl bg-white border border-[#E7DFD5] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2F5B3C]"></span>
                      <span className="font-semibold text-xs text-[#1F1916]">Proof-of-Fresh-Code Audit</span>
                      <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded-md font-bold border border-[#DEEBE1]">
                        94.8% ORGANIC
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#73645A]">
                      28 Commits • 4 Authors • 0 Bulk Dumps
                    </span>
                  </div>

                  {/* Commit Velocity Timeline Chart */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-[11px] text-[#73645A] font-mono mb-2">
                      <span>Commit Velocity (36-Hour Hackathon Window)</span>
                      <span className="text-[#2F5B3C] font-semibold">Continuous Evolution</span>
                    </div>
                    
                    {/* Visual 6-Stage Timeline */}
                    <div className="grid grid-cols-6 gap-1.5 h-16 items-end bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5]">
                      {[
                        { time: '0-6h', commits: 3, h: '35%', label: 'Scaffold' },
                        { time: '6-12h', commits: 5, h: '55%', label: 'Core EKF' },
                        { time: '12-18h', commits: 8, h: '95%', label: 'Sensors' },
                        { time: '18-24h', commits: 6, h: '70%', label: 'Mesh Sync' },
                        { time: '24-30h', commits: 4, h: '45%', label: 'Docker' },
                        { time: '30-36h', commits: 2, h: '25%', label: 'Docs/Bench' },
                      ].map((slot, i) => (
                        <div key={i} className="flex flex-col items-center h-full justify-end group relative">
                          <div
                            className="w-full bg-[#2F5B3C] hover:bg-[#C2542D] rounded-sm transition-all duration-300 relative"
                            style={{ height: slot.h }}
                          >
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#1F1916] opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-xs border border-gray-200 pointer-events-none">
                              {slot.commits}c
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-[#73645A] mt-1">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-[#73645A] font-mono mt-1.5 px-0.5">
                      <span>Hour 0: Clean Repo Init</span>
                      <span className="text-[#2F5B3C] font-medium">Peak Sprint: Hour 12–18 (Perception Loop)</span>
                      <span>Hour 36: Submission Locked</span>
                    </div>
                  </div>

                  {/* AST Origin Split */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#F0EAE1]">
                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">Original Code</span>
                      <span className="text-sm font-bold text-[#2F5B3C] mt-0.5 block">3,420 lines (82%)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">OSS Libraries</span>
                      <span className="text-sm font-bold text-[#1F1916] mt-0.5 block">680 lines (18%)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                      <span className="text-[10px] font-mono text-[#73645A] uppercase block">Plagiarism / Clones</span>
                      <span className="text-sm font-bold text-[#2F5B3C] mt-0.5 block">0% Detected</span>
                    </div>
                  </div>
                </div>

                {/* AI Tough Questions for Judges */}
                <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E7DFD5]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm text-[#C2542D]">psychology</span>
                    <span className="text-xs font-bold text-[#1F1916]">AI-Generated Verification Questions</span>
                    <span className="text-[10px] font-mono text-[#73645A] ml-auto">Ask during team demo</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E7DFD5] text-[#382F2A]">
                      <span className="font-semibold text-[#C2542D] mr-1.5 font-mono">Q1:</span>
                      How does your loop closure algorithm handle covariance divergence when operating across asymmetric radio packet loss?
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E7DFD5] text-[#382F2A]">
                      <span className="font-semibold text-[#C2542D] mr-1.5 font-mono">Q2:</span>
                      Why did you opt for an Extended Kalman Filter over a factor-graph optimization in the sensor fusion pipeline?
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E7DFD5] text-[#382F2A]">
                      <span className="font-semibold text-[#C2542D] mr-1.5 font-mono">Q3:</span>
                      Where are the edge latency bottlenecks if the point cloud exceeds 100k points/sec on the Jetson Orin?
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Automated Verification Tokens */}
          <div className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <span className="font-sans font-bold text-xs text-[#1F1916]">Automated Code & Benchmark SLA</span>
              <span className="font-mono text-[10px] text-[#2F5B3C] bg-[#EFF5F1] px-2 py-0.5 rounded font-semibold">
                SANDBOX PASS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">Git Commit</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-[#2F5B3C]">{currentProject.verification?.commit || "#d9e14a"}</span>
                  <button onClick={handleCopyCommit} className="material-symbols-outlined text-[13px] text-[#73645A] cursor-pointer">
                    {copiedCommit ? 'check' : 'content_copy'}
                  </button>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">Loop Latency</span>
                <span className="font-mono font-bold text-[#1F1916] mt-0.5 block">
                  {currentProject.verification?.docker_sla || "11.4ms"}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5]">
                <span className="text-[10px] text-[#73645A] font-mono block">Unit Tests</span>
                <span className="font-mono font-bold text-[#2F5B3C] mt-0.5 block">
                  {currentProject.verification?.unit_tests?.split(' ')[0] || "98.4%"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#73645A] pt-1 font-mono">
              <span>Target: AWS Graviton3 edge emulator</span>
              <button
                onClick={() => setShowLogModal(true)}
                className="text-[#2F5B3C] hover:underline font-semibold cursor-pointer"
              >
                Inspect Logs →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Weighted Scoring Matrix (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white rounded-xl p-5 border border-[#E7DFD5] shadow-card flex flex-col gap-4">
            {/* Score Banner */}
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#73645A] uppercase block">Weighted Composite Score</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif font-bold text-3xl text-[#1F1916]">{compositeScore}</span>
                  <span className="text-xs text-[#73645A]">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs bg-[#EFF5F1] text-[#2F5B3C] font-semibold px-2 py-0.5 rounded">
                  Top 5% Tier
                </span>
                <span className="text-[10px] text-[#73645A] block mt-1 font-mono">Track Median: 74.2</span>
              </div>
            </div>

            {/* Rubric Sliders */}
            <div className="flex flex-col gap-3 text-xs">
              {/* Criterion 1 */}
              <div className="pb-2 border-b border-[#F0EAE1]">
                <div className="flex justify-between font-medium">
                  <span>1. Technical Rigor & Code Depth <span className="text-[#73645A] text-[10px] font-mono">[30%]</span></span>
                  <span className="font-mono font-bold text-[#2F5B3C]">{scores.technical_rigor}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.technical_rigor}
                  onChange={(e) => setScores({ ...scores, technical_rigor: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E7DFD5] rounded appearance-none cursor-pointer accent-[#2F5B3C] mt-1.5"
                />
              </div>

              {/* Criterion 2 */}
              <div className="pb-2 border-b border-[#F0EAE1]">
                <div className="flex justify-between font-medium">
                  <span>2. Algorithmic Novelty <span className="text-[#73645A] text-[10px] font-mono">[25%]</span></span>
                  <span className="font-mono font-bold text-[#2F5B3C]">{scores.algorithmic_novelty}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.algorithmic_novelty}
                  onChange={(e) => setScores({ ...scores, algorithmic_novelty: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E7DFD5] rounded appearance-none cursor-pointer accent-[#2F5B3C] mt-1.5"
                />
              </div>

              {/* Criterion 3 */}
              <div className="pb-2 border-b border-[#F0EAE1]">
                <div className="flex justify-between font-medium">
                  <span>3. Real-World Edge Performance <span className="text-[#73645A] text-[10px] font-mono">[20%]</span></span>
                  <span className="font-mono font-bold text-[#2F5B3C]">{scores.edge_performance}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.edge_performance}
                  onChange={(e) => setScores({ ...scores, edge_performance: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E7DFD5] rounded appearance-none cursor-pointer accent-[#2F5B3C] mt-1.5"
                />
              </div>

              {/* Criterion 4 */}
              <div className="pb-2 border-b border-[#F0EAE1]">
                <div className="flex justify-between font-medium">
                  <span>4. Documentation & Verification <span className="text-[#73645A] text-[10px] font-mono">[15%]</span></span>
                  <span className="font-mono font-bold text-[#2F5B3C]">{scores.documentation}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.documentation}
                  onChange={(e) => setScores({ ...scores, documentation: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E7DFD5] rounded appearance-none cursor-pointer accent-[#2F5B3C] mt-1.5"
                />
              </div>

              {/* Criterion 5 */}
              <div className="pb-2 border-b border-[#F0EAE1]">
                <div className="flex justify-between font-medium">
                  <span>5. Track Mandate Fit <span className="text-[#73645A] text-[10px] font-mono">[10%]</span></span>
                  <span className="font-mono font-bold text-[#2F5B3C]">{scores.track_alignment}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.track_alignment}
                  onChange={(e) => setScores({ ...scores, track_alignment: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E7DFD5] rounded appearance-none cursor-pointer accent-[#2F5B3C] mt-1.5"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
                  Private Juror Deliberation Notes (Internal)
                </label>
                <textarea
                  rows={2}
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Notes for final jury deliberation round..."
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5] text-xs focus:outline-none focus:bg-white"
                ></textarea>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
                  Feedback for Submitting Team (Disclosed Post-Sprint)
                </label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5] text-xs focus:outline-none focus:bg-white"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSubmitEvaluation({
                  projectId: currentProject.id,
                  scores,
                  privateNotes,
                  feedback,
                  compositeScore
                })}
                className="w-full py-2.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] text-white font-semibold text-xs transition-colors shadow-subtle cursor-pointer"
              >
                Submit Score ({compositeScore}/100) & Next
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSaveDraft && onSaveDraft({
                    projectId: currentProject.id,
                    scores,
                    privateNotes,
                    feedback
                  })}
                  className="flex-1 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#1F1916] font-medium text-xs border border-[#E7DFD5] transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = submissions.findIndex(s => s.id === selectedProjectId);
                    const next = submissions[(idx + 1) % submissions.length];
                    if (next) setSelectedProjectId(next.id);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#73645A] font-medium text-xs border border-[#E7DFD5] transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <span className="font-mono text-xs font-semibold text-[#1F1916]">
                Benchmark Runner Log // #d9e14a
              </span>
              <button onClick={() => setShowLogModal(false)} className="material-symbols-outlined text-sm cursor-pointer">
                close
              </button>
            </div>
            <pre className="bg-[#FAF7F2] p-3 rounded-lg font-mono text-[11px] text-[#2F5B3C] max-h-60 overflow-y-auto leading-relaxed">
{`[0.014s] Zenoh P2P mesh established with 4 rover peers
[0.089s] Livox Mid-360 point cloud stream: 200,000 pts/sec
[0.104s] CUDA Deskew kernel executed: 2.14ms
[0.116s] Fast-LIO2 odometry pose estimation: 11.4ms (SLA < 15ms: PASS)
[0.280s] Pose graph optimized across 4 ground units. Drift: 2.8cm.
[0.312s] Replay completed with 0 errors. Exit Code: 0.`}
            </pre>
            <div className="flex justify-end">
              <button onClick={() => setShowLogModal(false)} className="px-3 py-1.5 bg-[#2F5B3C] text-white text-xs font-medium rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
