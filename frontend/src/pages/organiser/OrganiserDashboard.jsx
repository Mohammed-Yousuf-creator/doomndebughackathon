import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';

export default function OrganiserDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('hosted'); // 'hosted' | 'submissions' | 'system'
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Dashboard Data from backend
  const [dashboardData, setDashboardData] = useState({
    hosted_competitions: [],
    recent_submissions: [],
    metrics: {
      total_competitions: 0,
      total_participants: 0,
      total_submissions: 0
    }
  });

  // Modals & Forms
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [inspectLeaderboardComp, setInspectLeaderboardComp] = useState(null);
  const [inspectLeaderboardData, setInspectLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Host New Competition Form
  const [newCompForm, setNewCompForm] = useState({
    title: '',
    subtitle: '',
    category: 'Featured',
    prize_pool: '$50,000 USD',
    evaluation_metric: 'F1-Score',
    higher_is_better: true,
    deadline: '2026-12-31',
    description: '',
    dataset_overview: '',
    rules: 'Submissions are deterministically evaluated. No external test data leakage allowed.'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // ---------------- LOAD DATA ----------------

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.fetchOrganizerDashboard(user?.id || 'u-org-1');
      setDashboardData(res);
    } catch (err) {
      console.error('Error fetching organizer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  // ---------------- ACTIONS ----------------

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    if (!newCompForm.title.trim()) {
      showToast('Please provide a challenge title.');
      return;
    }
    try {
      const res = await api.createCompetition({
        ...newCompForm,
        host_id: user?.id || 'u-org-1',
        host_name: user?.name || 'Dr. Aris Vane'
      });
      showToast(`Challenge "${res.competition.title}" published!`);
      setIsHostModalOpen(false);
      setNewCompForm({
        title: '',
        subtitle: '',
        category: 'Featured',
        prize_pool: '$50,000 USD',
        evaluation_metric: 'F1-Score',
        higher_is_better: true,
        deadline: '2026-12-31',
        description: '',
        dataset_overview: '',
        rules: 'Submissions are deterministically evaluated. No external test data leakage allowed.'
      });
      loadDashboard();
    } catch (err) {
      showToast('Failed to create competition: ' + err.message);
    }
  };

  const handleInspectLeaderboard = async (comp) => {
    setInspectLeaderboardComp(comp);
    setLoadingLeaderboard(true);
    try {
      const res = await api.fetchLeaderboard(comp.id);
      setInspectLeaderboardData(res.leaderboard || []);
    } catch (err) {
      showToast('Failed to load leaderboard: ' + err.message);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleResetData = async (mode) => {
    try {
      setLoading(true);
      const res = await api.resetSystemData(mode);
      showToast(res.message);
      loadDashboard();
    } catch (err) {
      showToast('Error resetting data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedalBadge = (medal) => {
    if (medal === 'gold') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <span>🥇</span> Gold
        </span>
      );
    }
    if (medal === 'silver') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          <span>🥈</span> Silver
        </span>
      );
    }
    if (medal === 'bronze') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-300">
          <span>🥉</span> Bronze
        </span>
      );
    }
    return <span className="text-xs font-mono text-[#73645A]">Top 10</span>;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] flex flex-col font-sans selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F1916] text-[#FAF7F2] px-5 py-3 rounded-xl shadow-xl text-sm border border-[#E7DFD5]/20 flex items-center gap-3 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-[#2F5B3C]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Host Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-[#1F1916]">forge</span>
              <span className="h-2 w-2 rounded-full bg-[#2F5B3C]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2F5B3C] font-semibold px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                Host Console
              </span>
            </div>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#73645A]">
              <button
                onClick={() => setActiveTab('hosted')}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'hosted'
                    ? 'text-[#1F1916] bg-[#F4EFEA] font-semibold'
                    : 'hover:text-[#1F1916]'
                }`}
              >
                Hosted Benchmarks
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'text-[#1F1916] bg-[#F4EFEA] font-semibold'
                    : 'hover:text-[#1F1916]'
                }`}
              >
                Submissions Stream
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'system'
                    ? 'text-[#1F1916] bg-[#F4EFEA] font-semibold'
                    : 'hover:text-[#1F1916]'
                }`}
              >
                Platform Maintenance
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>+ Host Competition</span>
            </button>

            <button
              onClick={() => {
                switchRole('participant');
                navigate('/participant/dashboard');
              }}
              title="Switch to Participant Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#73645A] bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">terminal</span>
              <span>Competitor Portal</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E7DFD5]">
              <div className="h-8 w-8 rounded-xl bg-[#2F5B3C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AV'}
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="h-8 w-8 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] text-[#73645A] hover:text-[#943C1D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#73645A]">
              Hosted Competitions
            </div>
            <div className="text-3xl font-extrabold text-[#1F1916] font-mono">
              {dashboardData.metrics.total_competitions}
            </div>
            <div className="text-[11px] text-[#2F5B3C] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Live in SQLite DB</span>
            </div>
          </div>

          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#73645A]">
              Registered Competitors
            </div>
            <div className="text-3xl font-extrabold text-[#1F1916] font-mono">
              {dashboardData.metrics.total_participants}
            </div>
            <div className="text-[11px] text-[#73645A]">
              Across all hosted challenges
            </div>
          </div>

          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#73645A]">
              Evaluated Submissions
            </div>
            <div className="text-3xl font-extrabold text-[#2F5B3C] font-mono">
              {dashboardData.metrics.total_submissions}
            </div>
            <div className="text-[11px] text-[#73645A]">
              Deterministic auto-scoring
            </div>
          </div>

          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#73645A]">
              Benchmark Engine
            </div>
            <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 pt-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online &amp; Healthy</span>
            </div>
            <div className="text-[11px] text-[#73645A]">
              Zero dummy data active
            </div>
          </div>
        </div>

        {/* TAB 1: HOSTED COMPETITIONS */}
        {activeTab === 'hosted' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DFD5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#1F1916]">Your Hosted Benchmark Challenges</h2>
                <p className="text-xs text-[#73645A]">
                  Manage challenge configurations, inspect live leaderboards, and review competitor submissions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHostModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1F1916] text-[#FAF7F2] hover:bg-[#332A25] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>New Challenge</span>
                </button>
                <button
                  onClick={loadDashboard}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#73645A] bg-white hover:bg-[#FAF7F2] border border-[#E7DFD5] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#2F5B3C] border-t-transparent"></div>
                <p className="mt-3 text-xs text-[#73645A]">Loading hosted challenges from database...</p>
              </div>
            ) : dashboardData.hosted_competitions.length === 0 ? (
              /* REALISTIC EMPTY STATE - NO DUMMY DATA */
              <div className="bg-white border border-[#E7DFD5] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#73645A]">
                  <span className="material-symbols-outlined text-3xl">sports_score</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1F1916]">No Competitions Hosted Yet</h3>
                  <p className="text-xs text-[#73645A]">
                    You have not published any AI benchmark competitions yet. Launch a new challenge or seed a realistic benchmark demo challenge.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer"
                  >
                    + Host New Challenge
                  </button>
                  <button
                    onClick={() => handleResetData('sample')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E7DFD5] text-[#1F1916] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Seed Benchmark Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.hosted_competitions.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white border border-[#E7DFD5] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase font-semibold text-[#943C1D] px-2.5 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
                          {comp.category}
                        </span>
                        <span className="text-[11px] font-mono text-[#2F5B3C] font-semibold px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                          {comp.evaluation_metric}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#1F1916]">{comp.title}</h3>
                      <p className="text-xs text-[#73645A] line-clamp-2 leading-relaxed">
                        {comp.subtitle || comp.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#F0EAE1]">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#73645A] text-[11px]">Enrolled Teams:</span>
                          <strong className="block text-[#1F1916] font-mono text-sm">{comp.participants_count || 0}</strong>
                        </div>
                        <div>
                          <span className="text-[#73645A] text-[11px]">Submissions:</span>
                          <strong className="block text-[#1F1916] font-mono text-sm">{comp.submissions_count || 0}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleInspectLeaderboard(comp)}
                          className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] text-[#1F1916] transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">leaderboard</span>
                          <span>Leaderboard</span>
                        </button>
                        <button
                          onClick={() => {
                            switchRole('participant');
                            navigate('/participant/dashboard');
                          }}
                          className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] transition-colors cursor-pointer"
                        >
                          View as Competitor
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBMISSIONS STREAM */}
        {activeTab === 'submissions' && (
          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EAE1] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#1F1916]">Global Submissions Stream</h3>
                <p className="text-xs text-[#73645A]">
                  Real-time audit log of all model and code submissions evaluated by the automated engine.
                </p>
              </div>
              <button
                onClick={loadDashboard}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#73645A] bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Refresh Stream</span>
              </button>
            </div>

            {dashboardData.recent_submissions.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-[#73645A]">receipt_long</span>
                <h4 className="font-bold text-sm text-[#1F1916]">No Submissions Recorded Yet</h4>
                <p className="text-xs text-[#73645A] max-w-sm mx-auto">
                  When competitors submit code repositories or predictions, their automated scores will stream here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7DFD5] text-[#73645A] font-mono text-[10px] uppercase">
                      <th className="py-3 px-3">Competitor / Team</th>
                      <th className="py-3 px-3">Challenge</th>
                      <th className="py-3 px-3">Submission / Model</th>
                      <th className="py-3 px-3">Score</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {dashboardData.recent_submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3.5 px-3">
                          <strong className="text-[#1F1916] block">{sub.user_name}</strong>
                          <span className="text-[11px] text-[#73645A]">{sub.team_name || 'Solo'}</span>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-[#1F1916]">
                          {sub.competition_title}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#1F1916]">{sub.submission_name}</div>
                          <a
                            href={sub.repo_or_file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#943C1D] truncate block max-w-xs hover:underline"
                          >
                            {sub.repo_or_file_url}
                          </a>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#2F5B3C]">
                          {sub.score}
                          <span className="text-[10px] text-[#73645A] font-normal block">{sub.metric_used}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {sub.status || 'Complete'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[#73645A] text-[11px] font-mono">
                          {sub.submitted_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PLATFORM MAINTENANCE & TESTING */}
        {activeTab === 'system' && (
          <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#1F1916]">Platform Maintenance &amp; Zero-Dummy Guarantee</h3>
              <p className="text-xs text-[#73645A] mt-1">
                Use these tools to control your database state for pristine testing and demonstration.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1F1916]">Zero Dummy Data (Pure Clean Slate)</h4>
                  <p className="text-xs text-[#73645A]">
                    Wipes all competitions, submissions, leaderboards, and discussions. Keeps demo user accounts intact so you can test manual creation from scratch.
                  </p>
                </div>
                <button
                  onClick={() => handleResetData('clean')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                >
                  Reset to Blank Slate
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1F1916]">Seed 1 Realistic Benchmark Challenge</h4>
                  <p className="text-xs text-[#73645A]">
                    Seeds a single high-quality benchmark challenge ("LLM Autonomous Defense & Workflow Benchmark") with realistic dataset overview, metrics, and rules.
                  </p>
                </div>
                <button
                  onClick={() => handleResetData('sample')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer shrink-0"
                >
                  Load Sample Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: HOST COMPETITION */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#1F1916]">Publish Benchmark Challenge</h3>
                <p className="text-xs text-[#73645A]">Configure challenge parameters, metric, and evaluation rules.</p>
              </div>
              <button
                onClick={() => setIsHostModalOpen(false)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCompetition} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Challenge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Autonomous SLAM Sensor Drift Benchmark"
                  value={newCompForm.title}
                  onChange={(e) => setNewCompForm({ ...newCompForm, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Subtitle / Problem Summary</label>
                <input
                  type="text"
                  placeholder="e.g., Minimize loop-closure odometry error across 10,000 km test trajectories"
                  value={newCompForm.subtitle}
                  onChange={(e) => setNewCompForm({ ...newCompForm, subtitle: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Category</label>
                  <select
                    value={newCompForm.category}
                    onChange={(e) => setNewCompForm({ ...newCompForm, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3 py-2 text-xs text-[#1F1916] focus:outline-none cursor-pointer"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Research">Research</option>
                    <option value="Community">Community</option>
                    <option value="Getting Started">Getting Started</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Evaluation Metric</label>
                  <select
                    value={newCompForm.evaluation_metric}
                    onChange={(e) => {
                      const metric = e.target.value;
                      const higher = !['RMSE', 'MAE', 'LogLoss'].includes(metric);
                      setNewCompForm({ ...newCompForm, evaluation_metric: metric, higher_is_better: higher });
                    }}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3 py-2 text-xs text-[#1F1916] focus:outline-none cursor-pointer"
                  >
                    <option value="F1-Score">F1-Score (Classification)</option>
                    <option value="Accuracy">Accuracy (Classification)</option>
                    <option value="ROC-AUC">ROC-AUC (Probabilistic)</option>
                    <option value="RMSE">RMSE (Regression - Lower is better)</option>
                    <option value="MAE">MAE (Regression - Lower is better)</option>
                    <option value="LogLoss">LogLoss (Lower is better)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newCompForm.prize_pool}
                    onChange={(e) => setNewCompForm({ ...newCompForm, prize_pool: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1916] mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newCompForm.deadline}
                    onChange={(e) => setNewCompForm({ ...newCompForm, deadline: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Description & Context</label>
                <textarea
                  rows={3}
                  placeholder="Explain background, challenge formulation, and expected solution formats..."
                  value={newCompForm.description}
                  onChange={(e) => setNewCompForm({ ...newCompForm, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Dataset Overview</label>
                <textarea
                  rows={2}
                  placeholder="Describe dataset partitions, columns, and sample sizes..."
                  value={newCompForm.dataset_overview}
                  onChange={(e) => setNewCompForm({ ...newCompForm, dataset_overview: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsHostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] hover:bg-[#EFE9DF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer shadow-sm"
                >
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT LEADERBOARD */}
      {inspectLeaderboardComp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#1F1916]">
                  Leaderboard: {inspectLeaderboardComp.title}
                </h3>
                <p className="text-xs text-[#73645A]">
                  Metric: <span className="font-mono font-semibold text-[#2F5B3C]">{inspectLeaderboardComp.evaluation_metric}</span>
                </p>
              </div>
              <button
                onClick={() => setInspectLeaderboardComp(null)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {loadingLeaderboard ? (
              <div className="py-12 text-center text-xs text-[#73645A]">
                Loading live rankings...
              </div>
            ) : inspectLeaderboardData.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#73645A]">
                No submissions have been evaluated yet for this competition.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7DFD5] text-[#73645A] font-mono text-[10px] uppercase">
                      <th className="py-3 px-3">Rank</th>
                      <th className="py-3 px-3">Medal</th>
                      <th className="py-3 px-3">Team / Competitor</th>
                      <th className="py-3 px-3">Best Score</th>
                      <th className="py-3 px-3">Entries</th>
                      <th className="py-3 px-3">Last Submission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {inspectLeaderboardData.map((row) => (
                      <tr key={row.user_id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#1F1916]">
                          #{row.rank}
                        </td>
                        <td className="py-3.5 px-3">{getMedalBadge(row.medal)}</td>
                        <td className="py-3.5 px-3">
                          <strong className="text-[#1F1916] block">{row.team_name || row.user_name}</strong>
                          <span className="text-[11px] text-[#73645A]">{row.user_name}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#2F5B3C]">
                          {typeof row.score === 'number' ? row.score.toFixed(4) : row.score}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[#73645A]">
                          {row.entries_count}
                        </td>
                        <td className="py-3.5 px-3 text-[#73645A] text-[11px]">
                          {row.last_submission_time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#F0EAE1]">
              <button
                onClick={() => setInspectLeaderboardComp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#1F1916] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
