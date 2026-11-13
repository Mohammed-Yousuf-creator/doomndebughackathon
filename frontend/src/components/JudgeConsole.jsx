import React, { useState, useEffect } from 'react';

export default function JudgeConsole({
  data,
  onSubmitEvaluation,
  onSaveDraft
}) {
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video', 'deck', 'arch'
  const [currentSlide, setCurrentSlide] = useState(4);
  const totalSlides = 10;
  const [copiedCommit, setCopiedCommit] = useState(false);

  // Active rubric sliders
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

  // Initialize scores when project changes
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

  // Compute weighted composite score live
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

  const handleSubmit = () => {
    onSubmitEvaluation && onSubmitEvaluation({
      projectId: currentProject.id,
      scores,
      privateNotes,
      feedback,
      compositeScore
    });
  };

  const handleDraft = () => {
    onSaveDraft && onSaveDraft({
      projectId: currentProject.id,
      scores,
      privateNotes,
      feedback
    });
  };

  return (
    <div className="flex flex-col w-full pb-16 animate-fadeIn">
      {/* Top Control Bar / Judge Session Banner */}
      <div className="w-full bg-surface-container-low rounded-2xl p-5 mb-6 border border-surface-container-high shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Judge Identity & Assignment */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-headline font-bold text-base shadow-sm">
              {judgeProfile.initials || "AT"}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline font-bold text-lg text-on-surface">
                  {judgeProfile.name}
                </span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-semibold">
                  {judgeProfile.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-sm text-primary">account_tree</span>
                <span>{judgeProfile.track}</span>
              </div>
            </div>
          </div>

          {/* Anonymization & Quota Progress Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Protocol Lock Badge */}
            <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl border border-surface-container-high shadow-sm">
              <span className="material-symbols-outlined text-base text-secondary">visibility_off</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-secondary uppercase font-bold tracking-wider leading-none">
                  Protocol Lock
                </span>
                <span className="font-mono text-xs font-semibold text-on-surface leading-tight mt-0.5">
                  Double-Blind Active
                </span>
              </div>
            </div>

            {/* Evaluation Progress Tracker */}
            <div className="bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-surface-container-high shadow-sm min-w-[220px]">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                  Jury Quota
                </span>
                <span className="font-mono font-bold text-primary">
                  Project {judgeProfile.completed_count} of {judgeProfile.total_quota}
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${(judgeProfile.completed_count / judgeProfile.total_quota) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px] font-mono">
                <span className="text-outline">
                  {Math.round((judgeProfile.completed_count / judgeProfile.total_quota) * 100)}% Completed
                </span>
                <span className="text-secondary font-semibold">
                  {judgeProfile.remaining} remaining
                </span>
              </div>
            </div>

            {/* Project Quick Switcher */}
            {submissions.length > 1 && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-surface-container-lowest text-xs font-mono font-semibold text-on-surface px-3 py-2.5 rounded-xl border border-surface-container-high cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {submissions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Primary 2-Column Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Project Submission Inspector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Submission Identity & Overview */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-bold tracking-wider border border-surface-container-highest">
                    PROJECT #{currentProject.id}
                  </span>
                  <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {currentProject.tag || "Hardware Validated"}
                  </span>
                </div>
                <h1 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
                  {currentProject.title}
                </h1>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-outline uppercase block font-semibold">
                  Track Category
                </span>
                <span className="text-xs font-semibold text-primary">
                  {currentProject.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high mt-3 leading-relaxed">
              {currentProject.description}
            </p>

            {/* Media Viewer Tab Navigation */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl mt-4 mb-4 border border-surface-container-high">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMediaTab === 'video'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">videocam</span>
                <span>Video Demonstration</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('deck')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMediaTab === 'deck'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">slideshow</span>
                <span>Pitch Deck ({totalSlides})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('arch')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMediaTab === 'arch'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">schema</span>
                <span>Architecture & Stack</span>
              </button>
            </div>

            {/* TAB CONTENT 1: Video Demo Player */}
            {activeMediaTab === 'video' && (
              <div className="flex flex-col gap-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-inverse-surface shadow-md group">
                  <img
                    src={currentProject.video_url || "/assets/asset_07_940ce03e1c.png"}
                    alt="Video Telemetry Replay"
                    className="w-full h-full object-cover"
                  />
                  {/* Video Overlay UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-white text-xs font-mono">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span>4K / 60 FPS Telemetry Replay</span>
                      </span>
                      <span className="bg-black/50 px-2 py-0.5 rounded font-mono">
                        03:42 / 05:00
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Chapter Markers */}
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <button className="px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">flag</span>
                          <span>01:15 Live Hardware Test</span>
                        </button>
                        <button className="px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          <span>03:20 Failure Edge Cases</span>
                        </button>
                      </div>

                      {/* Video Seek Bar */}
                      <div className="w-full bg-white/30 h-1.5 rounded-full relative cursor-pointer">
                        <div className="bg-primary-fixed h-full rounded-full w-3/4 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-white text-xs pt-1">
                        <div className="flex items-center gap-3">
                          <button className="hover:text-primary-fixed transition-colors">
                            <span className="material-symbols-outlined text-xl">play_arrow</span>
                          </button>
                          <button className="hover:text-primary-fixed transition-colors">
                            <span className="material-symbols-outlined text-xl">volume_up</span>
                          </button>
                          <span className="font-mono text-[11px]">Jetson Orin Core #2: 48°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="hover:text-primary-fixed">
                            <span className="material-symbols-outlined text-base">settings</span>
                          </button>
                          <button className="hover:text-primary-fixed">
                            <span className="material-symbols-outlined text-base">fullscreen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] px-1">
                  <span>Caption: {currentProject.caption}</span>
                  <span>Dataset: {currentProject.dataset}</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Pitch Deck Slide Viewer */}
            {activeMediaTab === 'deck' && (
              <div className="flex flex-col gap-2">
                <div className="relative w-full aspect-[16/9] rounded-xl bg-surface-container-low overflow-hidden border border-surface-container-high flex flex-col justify-between p-4 shadow-sm">
                  <img
                    src={currentProject.deck_slide_url || "/assets/asset_18_11df169078.png"}
                    alt="Pitch Deck Slide"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="font-mono text-xs bg-white/95 px-3 py-1 rounded-lg shadow-sm text-on-surface font-semibold border border-surface-container-high">
                      Slide {String(currentSlide).padStart(2, '0')} / {totalSlides} — Distributed Loop Closure
                    </span>
                    <div className="flex items-center gap-1 bg-white/95 rounded-lg p-1 shadow-sm border border-surface-container-high">
                      <button className="p-1 hover:bg-surface-container rounded text-on-surface">
                        <span className="material-symbols-outlined text-sm">zoom_in</span>
                      </button>
                      <button className="p-1 hover:bg-surface-container rounded text-on-surface">
                        <span className="material-symbols-outlined text-sm">zoom_out</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentSlide(s => Math.max(1, s - 1))}
                      disabled={currentSlide === 1}
                      className="bg-white/95 hover:bg-white text-on-surface px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1 shadow-sm border border-surface-container-high disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span> Previous
                    </button>
                    <button
                      onClick={() => setCurrentSlide(s => Math.min(totalSlides, s + 1))}
                      disabled={currentSlide === totalSlides}
                      className="bg-white/95 hover:bg-white text-on-surface px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1 shadow-sm border border-surface-container-high disabled:opacity-50"
                    >
                      Next <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Architecture & Tech Stack */}
            {activeMediaTab === 'arch' && (
              <div className="flex flex-col gap-3">
                <div className="w-full aspect-[16/9] rounded-xl bg-surface-container-low p-4 overflow-hidden relative flex items-center justify-center border border-surface-container-high">
                  <img
                    src={currentProject.architecture_url || "/assets/asset_01_f6d18c8079.png"}
                    alt="System Architecture Diagram"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {currentProject.tech_stack?.map((t, idx) => (
                    <div key={idx} className="bg-surface-container p-3 rounded-xl border border-surface-container-high flex flex-col">
                      <span className="font-mono text-[10px] text-outline uppercase font-semibold">
                        {t.label}
                      </span>
                      <span className="text-xs font-bold text-on-surface mt-0.5">
                        {t.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code & Automated Verification Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <span className="font-headline font-bold text-sm text-on-surface">
                  Automated Verification Protocol
                </span>
              </div>
              <span className="font-mono text-[10px] bg-primary-fixed text-primary px-2.5 py-0.5 rounded font-bold">
                {currentProject.verification?.build_status || "SANDBOX-BUILD: PASS"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Commit Hash */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <span className="font-mono text-[10px] text-outline uppercase block font-semibold">
                  GitHub Tree Commit
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">terminal</span>
                  <span className="font-mono text-xs text-primary font-bold">
                    {currentProject.verification?.commit || "#d9e14a"}
                  </span>
                  <button
                    onClick={handleCopyCommit}
                    className="material-symbols-outlined text-xs text-outline hover:text-on-surface cursor-pointer"
                    title="Copy commit hash"
                  >
                    {copiedCommit ? 'check' : 'content_copy'}
                  </button>
                </div>
              </div>

              {/* Docker Bench SLA */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <span className="font-mono text-[10px] text-outline uppercase block font-semibold">
                  Docker Bench SLA
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-xs font-bold text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>{currentProject.verification?.docker_sla || "11.4ms latency"}</span>
                </div>
              </div>

              {/* Unit Test Coverage */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <span className="font-mono text-[10px] text-outline uppercase block font-semibold">
                  Regression Testing
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
                  <span className="font-bold text-primary">
                    {currentProject.verification?.unit_tests?.split(' ')[0] || "98.4%"}
                  </span>
                  <span className="text-on-surface-variant text-[11px]">
                    (124/126 Tests)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface-container p-3 rounded-xl text-xs font-mono">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base">integration_instructions</span>
                <span>Deterministic replay container executed on AWS Graviton3 edge emulator.</span>
              </div>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-3 py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer border border-surface-container-high"
              >
                View Log Stream
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Weighted Scoring Rubric Matrix (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high sticky top-20 flex flex-col gap-5">
            {/* Score Aggregate Header */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
              <div>
                <span className="font-mono text-[10px] text-outline uppercase tracking-wider block font-semibold">
                  Cumulative Composite Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-headline font-extrabold text-3xl text-primary">
                    {compositeScore}
                  </span>
                  <span className="font-headline font-semibold text-base text-on-surface-variant">
                    / 100
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs bg-primary-fixed text-primary px-3 py-1 rounded-full font-bold inline-block mb-1">
                  {currentProject.tier || "Top 5% Tier"}
                </span>
                <span className="font-mono text-[10px] text-outline block">
                  Median in Track: {currentProject.median_track_score || 74.2}
                </span>
              </div>
            </div>

            {/* Rubric Sliders Form */}
            <form className="flex flex-col gap-4">
              {/* Criterion 1: Technical Rigor */}
              <div className="flex flex-col gap-1 pb-2 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      1. Technical Rigor & Code Quality
                    </span>
                    <span className="font-mono text-[10px] text-outline">[W: 30%]</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {scores.technical_rigor} / 10
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Architectural complexity, clean modular C++, low-level efficiency, thread safety.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores.technical_rigor}
                  onChange={(e) => setScores({ ...scores, technical_rigor: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
              </div>

              {/* Criterion 2: Algorithmic Novelty */}
              <div className="flex flex-col gap-1 pb-2 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      2. Algorithmic Novelty & Innovation
                    </span>
                    <span className="font-mono text-[10px] text-outline">[W: 25%]</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {scores.algorithmic_novelty} / 10
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Original approach to distributed pose-graph optimization and low-bandwidth telemetry.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores.algorithmic_novelty}
                  onChange={(e) => setScores({ ...scores, algorithmic_novelty: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
              </div>

              {/* Criterion 3: Real-World Edge Performance */}
              <div className="flex flex-col gap-1 pb-2 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      3. Real-World Edge Performance
                    </span>
                    <span className="font-mono text-[10px] text-outline">[W: 20%]</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {scores.edge_performance} / 10
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Meets sub-15ms SLA on physical Jetson Orin with sustainable thermal dissipation.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores.edge_performance}
                  onChange={(e) => setScores({ ...scores, edge_performance: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
              </div>

              {/* Criterion 4: Documentation */}
              <div className="flex flex-col gap-1 pb-2 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      4. Documentation & Presentation
                    </span>
                    <span className="font-mono text-[10px] text-outline">[W: 15%]</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {scores.documentation} / 10
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Exemplary README, clear ROSbag playback scripts, concise visual exposition.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores.documentation}
                  onChange={(e) => setScores({ ...scores, documentation: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
              </div>

              {/* Criterion 5: Track Alignment */}
              <div className="flex flex-col gap-1 pb-2 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      5. Track Challenge Alignment
                    </span>
                    <span className="font-mono text-[10px] text-outline">[W: 10%]</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                    {scores.track_alignment} / 10
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Direct fulfillment of low-light multi-agent autonomous perimeter mapping mandates.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores.track_alignment}
                  onChange={(e) => setScores({ ...scores, track_alignment: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                />
              </div>

              {/* Qualitative Feedback Sections */}
              <div className="flex flex-col gap-3 pt-1">
                {/* Private Jury Notes */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-secondary">lock</span>
                      Private Jury Deliberation Notes
                    </label>
                    <span className="font-mono text-[10px] text-outline">Internal Only</span>
                  </div>
                  <textarea
                    rows={2}
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Remark on hardware validity, edge claims vs actual benchmark latency..."
                    className="w-full bg-surface-container-low text-on-surface text-xs p-3 rounded-xl border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors"
                  ></textarea>
                </div>

                {/* Team Feedback */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">forum</span>
                      Feedback for Submitting Team
                    </label>
                    <span className="font-mono text-[10px] text-outline">Disclosed Post-Sprint</span>
                  </div>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Constructive feedback for the engineering team..."
                    className="w-full bg-surface-container-low text-on-surface text-xs p-3 rounded-xl border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span>Submit Evaluation & Advance to Next Project</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDraft}
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container-high cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">bookmark</span>
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Skip to next project
                      const idx = submissions.findIndex(s => s.id === selectedProjectId);
                      const next = submissions[(idx + 1) % submissions.length];
                      if (next) setSelectedProjectId(next.id);
                    }}
                    className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-surface-container-high cursor-pointer"
                  >
                    <span>Skip</span>
                    <span className="material-symbols-outlined text-sm">redo</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Log Stream Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-base">terminal</span>
                <span>Deterministic Replay Stream // Graviton3-Build-#d9e14a</span>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                close
              </button>
            </div>
            <pre className="bg-surface-container-highest p-4 rounded-xl font-mono text-xs text-on-surface max-h-80 overflow-y-auto leading-relaxed">
{`[0.001s] [INFO] ROS2 Humble daemon initialized in ad-hoc namespace
[0.014s] [INFO] Zenoh P2P mesh established with 4 rover peers
[0.089s] [INFO] Livox Mid-360 point cloud stream: 200,000 pts/sec
[0.104s] [INFO] CUDA Deskew kernel executed: 2.14ms
[0.116s] [INFO] Fast-LIO2 odometry pose state estimation: 11.4ms (SLA target < 15ms: PASS)
[0.240s] [INFO] Loop closure candidate detected (score: 0.94)
[0.280s] [INFO] Pose graph optimized across 4 ground units. Drift: 2.8cm.
[0.312s] [BENCHMARK] Replay completed with 0 errors. Exit Code: 0.`}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-primary text-white text-xs font-mono font-semibold rounded-xl"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

