import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';

export default function ParticipantDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  // 'competitions' | 'competition-detail' | 'my-submissions' | 'profile'
  const [currentView, setCurrentView] = useState('competitions');
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [activeCompTab, setActiveCompTab] = useState('overview'); // 'overview' | 'leaderboard' | 'submit' | 'discussions' | 'rules'

  // Data States
  const [competitions, setCompetitions] = useState([]);
  const [currentComp, setCurrentComp] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Modals & Inputs
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Join Form
  const [joinTeamName, setJoinTeamName] = useState('');

  // Submission Form
  const [submitting, setSubmitting] = useState(false);
  const [submissionName, setSubmissionName] = useState('');
  const [repoOrFileUrl, setRepoOrFileUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [latestEvalResult, setLatestEvalResult] = useState(null);

  // Discussion Form
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscTag, setNewDiscTag] = useState('Baseline');
  const [newDiscContent, setNewDiscContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');

  // Host Competition Form (Can also be triggered from participant view!)
  const [newCompForm, setNewCompForm] = useState({
    title: '',
    subtitle: '',
    category: 'Featured',
    prize_pool: '$25,000 USD',
    evaluation_metric: 'F1-Score',
    higher_is_better: true,
    deadline: '2026-12-31',
    description: '',
    dataset_overview: '',
    rules: 'One account per participant. Privately sharing code outside of teams is not permitted. Submission must be reproducible.'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // ---------------- LOAD DATA ----------------

  const loadCompetitions = async () => {
    setLoading(true);
    try {
      const res = await api.fetchCompetitions(selectedCategory, searchQuery);
      setCompetitions(res.competitions || []);
    } catch (err) {
      console.error('Failed to load competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompetitions();
  }, [selectedCategory, searchQuery]);

  const loadCompetitionDetail = async (compId) => {
    try {
      const comp = await api.fetchCompetitionById(compId, user?.id);
      setCurrentComp(comp);
      setSelectedCompId(compId);
      setCurrentView('competition-detail');
      setActiveCompTab('overview');

      // Load sub-resources
      loadLeaderboardData(compId);
      loadDiscussionsData(compId);
      if (user?.id) {
        loadUserSubmissionsData(compId, user.id);
      }
    } catch (err) {
      showToast('Error opening challenge: ' + err.message);
    }
  };

  const loadLeaderboardData = async (compId) => {
    try {
      const res = await api.fetchLeaderboard(compId);
      setLeaderboard(res.leaderboard || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const loadUserSubmissionsData = async (compId, userId) => {
    try {
      const res = await api.fetchUserSubmissions(compId, userId);
      setUserSubmissions(res.submissions || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const loadDiscussionsData = async (compId) => {
    try {
      const res = await api.fetchDiscussions(compId);
      setDiscussions(res.discussions || []);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;
    try {
      const prof = await api.fetchUserProfile(user.id);
      setUserProfile(prof);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (currentView === 'profile') {
      loadUserProfile();
    }
  }, [currentView]);

  // ---------------- ACTIONS ----------------

  const handleJoinCompetition = async (e) => {
    e.preventDefault();
    if (!currentComp || !user?.id) return;
    try {
      await api.joinCompetition(currentComp.id, user.id, joinTeamName || user.name);
      showToast(`Successfully enrolled in "${currentComp.title}"!`);
      setIsJoinModalOpen(false);
      loadCompetitionDetail(currentComp.id);
    } catch (err) {
      showToast('Failed to join: ' + err.message);
    }
  };

  const handleSubmitPrediction = async (e) => {
    e.preventDefault();
    if (!submissionName.trim() || !repoOrFileUrl.trim()) {
      showToast('Please provide both submission name and model/repository URL.');
      return;
    }
    setSubmitting(true);
    setLatestEvalResult(null);

    try {
      const res = await api.submitPrediction(
        currentComp.id,
        user?.id || 'u-part-1',
        submissionName,
        repoOrFileUrl,
        submissionNotes
      );
      setLatestEvalResult(res.submission);
      showToast(`Evaluated! Score: ${res.submission.score} (${res.submission.metric})`);
      setSubmissionName('');
      setRepoOrFileUrl('');
      setSubmissionNotes('');

      // Refresh submissions & leaderboard
      loadUserSubmissionsData(currentComp.id, user?.id || 'u-part-1');
      loadLeaderboardData(currentComp.id);
    } catch (err) {
      showToast('Evaluation failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscTitle.trim() || !newDiscContent.trim()) {
      showToast('Please enter both title and content for your discussion.');
      return;
    }
    try {
      await api.createDiscussion(
        currentComp.id,
        user?.id || 'u-part-1',
        newDiscTitle,
        newDiscContent,
        newDiscTag
      );
      showToast('Discussion published successfully!');
      setIsNewDiscussionOpen(false);
      setNewDiscTitle('');
      setNewDiscContent('');
      loadDiscussionsData(currentComp.id);
    } catch (err) {
      showToast('Failed to publish discussion: ' + err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !activeDiscussion) return;
    try {
      const res = await api.addComment(
        activeDiscussion.id,
        user?.id || 'u-part-1',
        newCommentContent
      );
      setActiveDiscussion((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.comment]
      }));
      setNewCommentContent('');
      loadDiscussionsData(currentComp.id);
      showToast('Comment posted!');
    } catch (err) {
      showToast('Failed to post comment: ' + err.message);
    }
  };

  const handleUpvoteDiscussion = async (discId, e) => {
    e.stopPropagation();
    try {
      const res = await api.upvoteDiscussion(discId);
      setDiscussions((prev) =>
        prev.map((d) => (d.id === discId ? { ...d, upvotes: res.upvotes } : d))
      );
      if (activeDiscussion && activeDiscussion.id === discId) {
        setActiveDiscussion((prev) => ({ ...prev, upvotes: res.upvotes }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHostCompetition = async (e) => {
    e.preventDefault();
    if (!newCompForm.title.trim()) {
      showToast('Please enter a competition title.');
      return;
    }
    try {
      const res = await api.createCompetition({
        ...newCompForm,
        host_id: user?.id || 'u-part-1',
        host_name: user?.name || 'Aegis Host'
      });
      showToast(`Competition "${res.competition.title}" hosted successfully!`);
      setIsHostModalOpen(false);
      loadCompetitions();
      loadCompetitionDetail(res.competition.id);
    } catch (err) {
      showToast('Failed to create competition: ' + err.message);
    }
  };

  const handleLoadSampleChallenge = async () => {
    try {
      setLoading(true);
      await api.resetSystemData('sample');
      showToast('Sample AI Benchmark Challenge loaded!');
      loadCompetitions();
    } catch (err) {
      showToast('Error loading sample: ' + err.message);
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

      {/* Top Kaggle Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => {
                setCurrentView('competitions');
                setSelectedCompId(null);
                setCurrentComp(null);
              }}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <span className="font-bold text-2xl tracking-tight text-[#1F1916] group-hover:text-[#943C1D] transition-colors">
                forge
              </span>
              <span className="h-2 w-2 rounded-full bg-[#943C1D]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#73645A] px-2 py-0.5 bg-[#F4EFEA] rounded-lg border border-[#E7DFD5]">
                AI Benchmarks
              </span>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#73645A]">
              <button
                onClick={() => {
                  setCurrentView('competitions');
                  setSelectedCompId(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'competitions'
                    ? 'text-[#1F1916] bg-[#F4EFEA] font-semibold'
                    : 'hover:text-[#1F1916]'
                }`}
              >
                Competitions
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'profile'
                    ? 'text-[#1F1916] bg-[#F4EFEA] font-semibold'
                    : 'hover:text-[#1F1916]'
                }`}
              >
                My Profile & Medals
              </button>
            </nav>
          </div>

          {/* Search Box */}
          {currentView === 'competitions' && (
            <div className="hidden sm:flex flex-1 max-w-md items-center relative">
              <span className="material-symbols-outlined text-[#73645A] absolute left-3 text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search competitions by model, metric, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl pl-10 pr-4 py-1.5 text-xs text-[#1F1916] placeholder-[#8A7A70] focus:outline-none focus:ring-1 focus:ring-[#943C1D] focus:border-[#943C1D] transition-all"
              />
            </div>
          )}

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Host Challenge</span>
            </button>

            <button
              onClick={() => {
                switchRole('organiser');
                navigate('/organiser/dashboard');
              }}
              title="Switch to Organizer Management Portal"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#73645A] bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">shield_person</span>
              <span>Host Console</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E7DFD5]">
              <div
                onClick={() => setCurrentView('profile')}
                className="h-8 w-8 rounded-xl bg-[#943C1D] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm"
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: COMPETITIONS LIST HUB */}
        {currentView === 'competitions' && (
          <div className="space-y-6">
            {/* Hero / Banner */}
            <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="max-w-3xl space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-[#2F5B3C]">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  <span>Autonomous AI & Machine Learning Benchmarks</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F1916]">
                  Competitive Benchmarks for Production Models
                </h1>
                <p className="text-sm sm:text-base text-[#73645A] leading-relaxed">
                  Join real machine learning challenges, submit model checkpoints, and get deterministically evaluated against test sets with verified real-time leaderboards.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F1916] text-[#FAF7F2] hover:bg-[#332A25] transition-colors cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Host New Challenge</span>
                  </button>
                  {competitions.length === 0 && (
                    <button
                      onClick={handleLoadSampleChallenge}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#2F5B3C] border border-[#2F5B3C] hover:bg-[#FAF7F2] transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Seed Benchmark Demo Challenge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Categories & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DFD5] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'Featured', 'Research', 'Community', 'Getting Started'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#1F1916] text-[#FAF7F2] shadow-sm'
                        : 'bg-white text-[#73645A] border border-[#E7DFD5] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {cat === 'all' ? 'All Competitions' : cat}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-[#73645A]">
                Showing {competitions.length} active {competitions.length === 1 ? 'challenge' : 'challenges'}
              </div>
            </div>

            {/* Competitions Grid */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#2F5B3C] border-t-transparent"></div>
                <p className="mt-3 text-xs text-[#73645A]">Connecting to SQLite benchmark repository...</p>
              </div>
            ) : competitions.length === 0 ? (
              /* REALISTIC ZERO DUMMY DATA EMPTY STATE */
              <div className="bg-white border border-[#E7DFD5] rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#73645A]">
                  <span className="material-symbols-outlined text-3xl">inbox</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1F1916]">No Competitions Active Yet</h3>
                  <p className="text-xs text-[#73645A] max-w-md mx-auto">
                    The platform currently has zero dummy data. You can host your own real competition or seed a realistic benchmark challenge with one click.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer"
                  >
                    Host a Challenge
                  </button>
                  <button
                    onClick={handleLoadSampleChallenge}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E7DFD5] text-[#1F1916] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    Load Sample Benchmark Challenge
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => loadCompetitionDetail(comp.id)}
                    className="bg-white border border-[#E7DFD5] hover:border-[#943C1D]/60 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="space-y-3">
                      {/* Category & Metric badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase font-semibold text-[#943C1D] px-2.5 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
                          {comp.category || 'Featured'}
                        </span>
                        <span className="text-[11px] font-mono text-[#2F5B3C] font-semibold px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                          {comp.evaluation_metric || 'F1-Score'}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="font-bold text-base text-[#1F1916] group-hover:text-[#943C1D] transition-colors line-clamp-2">
                          {comp.title}
                        </h3>
                        <p className="text-xs text-[#73645A] mt-1.5 line-clamp-2 leading-relaxed">
                          {comp.subtitle || comp.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="pt-5 mt-4 border-t border-[#F0EAE1] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1F1916]">
                          {comp.prize_pool || 'Knowledge & Medals'}
                        </span>
                        <span className="text-[#73645A] font-mono text-[11px]">
                          Deadline: {comp.deadline || 'Ongoing'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#73645A]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">group</span>
                            {comp.participants_count || 0} teams
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">upload_file</span>
                            {comp.submissions_count || 0} entries
                          </span>
                        </div>
                        <span className="font-semibold text-[#943C1D] group-hover:underline">
                          View Challenge &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ACTIVE COMPETITION DETAIL WORKSPACE */}
        {currentView === 'competition-detail' && currentComp && (
          <div className="space-y-6">
            {/* Top Breadcrumb & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => {
                  setCurrentView('competitions');
                  setSelectedCompId(null);
                  setCurrentComp(null);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#73645A] hover:text-[#1F1916] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Competitions</span>
              </button>

              <div className="flex items-center gap-2">
                {currentComp.is_joined ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Enrolled: {currentComp.user_team_name || 'Solo Competitor'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">group_add</span>
                    <span>Join Competition</span>
                  </button>
                )}

                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#1F1916] text-[#FAF7F2] hover:bg-[#332A25] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">publish</span>
                  <span>Submit Predictions</span>
                </button>
              </div>
            </div>

            {/* Competition Header Card */}
            <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-semibold uppercase text-[#943C1D] px-2.5 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
                  {currentComp.category || 'Featured'}
                </span>
                <span className="text-xs font-mono font-semibold text-[#2F5B3C] px-2.5 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  Metric: {currentComp.evaluation_metric} ({currentComp.higher_is_better ? 'Higher is better' : 'Lower is better'})
                </span>
                <span className="text-xs font-semibold text-[#73645A]">
                  Hosted by <strong className="text-[#1F1916]">{currentComp.host_name || 'Benchmark Host'}</strong>
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1916] tracking-tight">
                  {currentComp.title}
                </h1>
                <p className="text-sm text-[#73645A] mt-2 max-w-4xl leading-relaxed">
                  {currentComp.subtitle || currentComp.description}
                </p>
              </div>

              {/* KPI chips */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#F0EAE1] text-xs">
                <div>
                  <span className="text-[#73645A]">Prize Pool: </span>
                  <strong className="text-[#1F1916] font-mono">{currentComp.prize_pool || 'Medals & Points'}</strong>
                </div>
                <div>
                  <span className="text-[#73645A]">Deadline: </span>
                  <strong className="text-[#1F1916] font-mono">{currentComp.deadline || '2026-12-31'}</strong>
                </div>
                <div>
                  <span className="text-[#73645A]">Total Teams: </span>
                  <strong className="text-[#1F1916] font-mono">{leaderboard.length} enrolled</strong>
                </div>
                <div>
                  <span className="text-[#73645A]">Your Entries: </span>
                  <strong className="text-[#1F1916] font-mono">{userSubmissions.length}</strong>
                </div>
              </div>
            </div>

            {/* Kaggle Workspace Tabs */}
            <div className="border-b border-[#E7DFD5] flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { key: 'overview', label: 'Overview', icon: 'info' },
                { key: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
                { key: 'submit', label: 'Submit Predictions', icon: 'upload' },
                { key: 'discussions', label: `Discussions (${discussions.length})`, icon: 'forum' },
                { key: 'rules', label: 'Rules & Evaluation', icon: 'gavel' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveCompTab(tab.key);
                    setActiveDiscussion(null);
                  }}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                    activeCompTab === tab.key
                      ? 'border-[#943C1D] text-[#943C1D] bg-white border-t border-x border-[#E7DFD5]'
                      : 'border-transparent text-[#73645A] hover:text-[#1F1916] hover:bg-[#F4EFEA]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW */}
            {activeCompTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description Section */}
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-3">
                    <h3 className="font-bold text-base text-[#1F1916]">Challenge Description</h3>
                    <div className="text-sm text-[#73645A] leading-relaxed whitespace-pre-line">
                      {currentComp.description || 'No description provided for this challenge.'}
                    </div>
                  </div>

                  {/* Dataset Section */}
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-3">
                    <h3 className="font-bold text-base text-[#1F1916]">Dataset Overview & Schema</h3>
                    <div className="text-sm text-[#73645A] leading-relaxed whitespace-pre-line">
                      {currentComp.dataset_overview || 'Dataset files and evaluation samples are managed deterministically through the platform evaluator.'}
                    </div>
                  </div>
                </div>

                {/* Sidebar details */}
                <div className="space-y-6">
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-[#1F1916]">Evaluation Metric</h3>
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                      <div className="font-mono text-xs font-bold text-[#2F5B3C]">
                        {currentComp.evaluation_metric}
                      </div>
                      <p className="text-[11px] text-[#73645A]">
                        {currentComp.higher_is_better ? 'Higher score represents superior performance.' : 'Lower error score represents superior performance.'}
                      </p>
                    </div>

                    <h3 className="font-bold text-sm text-[#1F1916]">Host Details</h3>
                    <div className="text-xs text-[#73645A] space-y-1">
                      <p><strong className="text-[#1F1916]">Host:</strong> {currentComp.host_name}</p>
                      <p><strong className="text-[#1F1916]">Category:</strong> {currentComp.category}</p>
                      <p><strong className="text-[#1F1916]">Created:</strong> {currentComp.created_at}</p>
                    </div>

                    <button
                      onClick={() => setActiveCompTab('submit')}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer"
                    >
                      Make a Submission
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. LEADERBOARD */}
            {activeCompTab === 'leaderboard' && (
              <div className="bg-white border border-[#E7DFD5] rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EAE1] pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1F1916]">Public Leaderboard</h3>
                    <p className="text-xs text-[#73645A]">
                      Evaluated on test set using <span className="font-mono font-semibold text-[#2F5B3C]">{currentComp.evaluation_metric}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => loadLeaderboardData(currentComp.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#73645A] bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span>Refresh Leaderboard</span>
                  </button>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#73645A]">
                      <span className="material-symbols-outlined text-2xl">trophy</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1F1916]">Leaderboard is Empty</h4>
                    <p className="text-xs text-[#73645A] max-w-sm mx-auto">
                      No models have been submitted yet. Be the first competitor to establish the baseline score!
                    </p>
                    <button
                      onClick={() => setActiveCompTab('submit')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer"
                    >
                      Submit First Baseline
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E7DFD5] text-[#73645A] uppercase tracking-wider font-mono text-[10px]">
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Medal</th>
                          <th className="py-3 px-4">Team / Competitor</th>
                          <th className="py-3 px-4">Best Score ({currentComp.evaluation_metric})</th>
                          <th className="py-3 px-4">Total Entries</th>
                          <th className="py-3 px-4">Last Entry</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE1]">
                        {leaderboard.map((row) => {
                          const isCurrentUser = row.user_id === user?.id;
                          return (
                            <tr
                              key={row.user_id}
                              className={`transition-colors ${
                                isCurrentUser
                                  ? 'bg-amber-50/70 font-medium'
                                  : 'hover:bg-[#FAF7F2]'
                              }`}
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1F1916]">
                                #{row.rank}
                              </td>
                              <td className="py-3.5 px-4">
                                {getMedalBadge(row.medal)}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[#1F1916]">
                                    {row.team_name || row.user_name}
                                  </span>
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1F1916] text-[#FAF7F2]">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#73645A] block">
                                  {row.user_name}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#2F5B3C]">
                                {typeof row.score === 'number' ? row.score.toFixed(4) : row.score}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[#73645A]">
                                {row.entries_count}
                              </td>
                              <td className="py-3.5 px-4 text-[#73645A] text-[11px]">
                                {row.last_submission_time}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 3. SUBMIT PREDICTIONS */}
            {activeCompTab === 'submit' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Evaluation Result Banner if just evaluated */}
                  {latestEvalResult && (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-sm space-y-2">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <span className="material-symbols-outlined text-emerald-700">check_circle</span>
                        <span>Automated Benchmark Evaluation Succeeded!</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-1">
                        <div>
                          <span className="text-emerald-700">Submission:</span>
                          <strong className="block text-emerald-950 font-medium">{latestEvalResult.submission_name}</strong>
                        </div>
                        <div>
                          <span className="text-emerald-700">Calculated Score:</span>
                          <strong className="block text-emerald-950 font-mono text-base font-bold">{latestEvalResult.score}</strong>
                        </div>
                        <div>
                          <span className="text-emerald-700">Metric Used:</span>
                          <strong className="block text-emerald-950">{latestEvalResult.metric}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-800 pt-1">
                        Your score has been registered on the live leaderboard. You can check your updated rank above.
                      </p>
                    </div>
                  )}

                  {/* Submit Form */}
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="border-b border-[#F0EAE1] pb-3">
                      <h3 className="font-bold text-base text-[#1F1916]">Make a Benchmark Submission</h3>
                      <p className="text-xs text-[#73645A]">
                        Submit your code repository, prediction file, or checkpoint link for deterministic automated scoring.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitPrediction} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                          Submission Title / Model Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., DeBERTa-v3 Multi-Task Baseline v1"
                          value={submissionName}
                          onChange={(e) => setSubmissionName(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                          GitHub Repo / Hugging Face Checkpoint / Prediction File URL *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/model-checkpoint or https://huggingface.co/..."
                          value={repoOrFileUrl}
                          onChange={(e) => setRepoOrFileUrl(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                          Notes / Hypothesis / Hyperparameters (Optional)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Trained with AdamW lr=2e-5, cosine scheduler, batch size 32, mixed precision fp16."
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                              <span>Evaluating Model...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">publish</span>
                              <span>Evaluate Submission</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* User Submissions History Table */}
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-[#1F1916]">Your Submission History</h3>
                    {userSubmissions.length === 0 ? (
                      <p className="text-xs text-[#73645A]">
                        You haven't submitted any models to this challenge yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#E7DFD5] text-[#73645A] font-mono text-[10px] uppercase">
                              <th className="py-2.5 px-3">Submission</th>
                              <th className="py-2.5 px-3">Score</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Submitted At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0EAE1]">
                            {userSubmissions.map((sub) => (
                              <tr key={sub.id} className="hover:bg-[#FAF7F2]">
                                <td className="py-3 px-3">
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
                                <td className="py-3 px-3 font-mono font-bold text-sm text-[#2F5B3C]">
                                  {sub.score}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {sub.status || 'Complete'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-[#73645A] text-[11px]">
                                  {sub.submitted_at}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Rules & Guidelines Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-[#1F1916]">Automated Evaluator Rules</h3>
                    <ul className="text-xs text-[#73645A] space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Automated engine deterministically evaluates repository code against benchmark test partition.</li>
                      <li>Leaderboard dynamically selects your <strong>best score</strong> to compute team rank.</li>
                      <li>Daily submission limit: 5 submissions per 24 hours.</li>
                      <li>External pre-trained weights permitted as specified in challenge rules.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. DISCUSSIONS */}
            {activeCompTab === 'discussions' && (
              <div className="space-y-6">
                {activeDiscussion ? (
                  /* Single Discussion Thread Detail View */
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-6">
                    <button
                      onClick={() => setActiveDiscussion(null)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#73645A] hover:text-[#1F1916] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <span>Back to Discussion Topics</span>
                    </button>

                    <div className="space-y-3 border-b border-[#F0EAE1] pb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-[#943C1D] font-semibold">
                          {activeDiscussion.tag}
                        </span>
                        <span className="text-xs text-[#73645A]">
                          Posted by <strong className="text-[#1F1916]">{activeDiscussion.author_name}</strong> &bull; {activeDiscussion.created_at}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-[#1F1916]">{activeDiscussion.title}</h2>
                      <div className="text-sm text-[#73645A] leading-relaxed whitespace-pre-line pt-2">
                        {activeDiscussion.content}
                      </div>
                      <div className="flex items-center gap-3 pt-3">
                        <button
                          onClick={(e) => handleUpvoteDiscussion(activeDiscussion.id, e)}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] text-[#1F1916] flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#943C1D]">thumb_up</span>
                          <span>{activeDiscussion.upvotes || 0} Upvotes</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm text-[#1F1916]">
                        Replies ({activeDiscussion.comments ? activeDiscussion.comments.length : 0})
                      </h4>

                      {activeDiscussion.comments && activeDiscussion.comments.length > 0 ? (
                        <div className="space-y-3">
                          {activeDiscussion.comments.map((comm) => (
                            <div key={comm.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-[#73645A]">
                                <strong className="text-[#1F1916]">{comm.author_name}</strong>
                                <span>{comm.created_at}</span>
                              </div>
                              <p className="text-xs text-[#1F1916] leading-relaxed">{comm.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#73645A]">No replies yet. Be the first to share your thoughts.</p>
                      )}

                      {/* Add Comment Box */}
                      <form onSubmit={handleAddComment} className="pt-3 space-y-3">
                        <textarea
                          rows={3}
                          required
                          placeholder="Write a constructive response or question..."
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* Discussions List View */
                  <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EAE1] pb-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#1F1916]">Community Discussions</h3>
                        <p className="text-xs text-[#73645A]">
                          Share insights, discuss exploratory data analysis, and debate model architectures.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsNewDiscussionOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>New Topic</span>
                      </button>
                    </div>

                    {discussions.length === 0 ? (
                      <div className="py-16 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#73645A]">
                          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#1F1916]">No Discussion Topics Yet</h4>
                        <p className="text-xs text-[#73645A] max-w-sm mx-auto">
                          Be the first to create a discussion topic about baselines, EDA findings, or questions.
                        </p>
                        <button
                          onClick={() => setIsNewDiscussionOpen(true)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer"
                        >
                          Start First Discussion
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F0EAE1]">
                        {discussions.map((disc) => (
                          <div
                            key={disc.id}
                            onClick={() => setActiveDiscussion(disc)}
                            className="py-4 flex items-start justify-between gap-4 hover:bg-[#FAF7F2] px-3 rounded-xl transition-colors cursor-pointer group"
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-white border border-[#E7DFD5] text-[#943C1D]">
                                  {disc.tag}
                                </span>
                                <span className="text-xs text-[#73645A]">
                                  {disc.author_name} &bull; {disc.created_at}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-[#1F1916] group-hover:text-[#943C1D] transition-colors truncate">
                                {disc.title}
                              </h4>
                              <p className="text-xs text-[#73645A] line-clamp-1">
                                {disc.content}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 pt-1">
                              <button
                                onClick={(e) => handleUpvoteDiscussion(disc.id, e)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-[#FAF7F2] border border-[#E7DFD5] text-[#1F1916] flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs text-[#943C1D]">thumb_up</span>
                                <span>{disc.upvotes || 0}</span>
                              </button>
                              <div className="flex items-center gap-1 text-xs text-[#73645A]">
                                <span className="material-symbols-outlined text-xs">comment</span>
                                <span>{disc.comments ? disc.comments.length : 0}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 5. RULES & EVALUATION */}
            {activeCompTab === 'rules' && (
              <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="font-bold text-base text-[#1F1916]">Competition Rules & Guidelines</h3>
                <div className="text-sm text-[#73645A] leading-relaxed whitespace-pre-line">
                  {currentComp.rules || 'Standard benchmark competition rules apply. Check back for official guidelines.'}
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2 mt-4">
                  <h4 className="font-bold text-xs text-[#1F1916] uppercase tracking-wider font-mono">
                    Official Disclosures & Eligibility
                  </h4>
                  <p className="text-xs text-[#73645A]">
                    Submissions are verified against deterministic unit tests. Any form of data leakage or test set memorization will disqualify the competitor from the prize pool.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PROFILE & MEDALS HUB */}
        {currentView === 'profile' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white border border-[#E7DFD5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-[#943C1D] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1F1916]">{user?.name || 'Competitor'}</h2>
                  <p className="text-xs text-[#73645A]">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] text-[#2F5B3C]">
                      Role: Competitor
                    </span>
                    <span className="text-xs font-mono text-[#73645A]">
                      ID: {user?.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medals & Stats Tally */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#F0EAE1]">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                  <div className="text-2xl font-extrabold text-[#1F1916] font-mono">
                    {userProfile?.joined_competitions ? userProfile.joined_competitions.length : 0}
                  </div>
                  <div className="text-[11px] text-[#73645A] uppercase tracking-wider font-mono mt-1">
                    Competitions
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                  <div className="text-2xl font-extrabold text-[#2F5B3C] font-mono">
                    {userProfile?.total_submissions || 0}
                  </div>
                  <div className="text-[11px] text-[#73645A] uppercase tracking-wider font-mono mt-1">
                    Submissions
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                  <div className="text-2xl font-extrabold text-amber-700 font-mono">
                    {userProfile?.points || 0}
                  </div>
                  <div className="text-[11px] text-[#73645A] uppercase tracking-wider font-mono mt-1">
                    Platform Points
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                  <div className="text-2xl font-extrabold text-[#943C1D] font-mono">
                    Active
                  </div>
                  <div className="text-[11px] text-[#73645A] uppercase tracking-wider font-mono mt-1">
                    Status
                  </div>
                </div>
              </div>

              {/* Joined Competitions List */}
              <div className="space-y-3 pt-4 border-t border-[#F0EAE1]">
                <h3 className="font-bold text-sm text-[#1F1916]">Enrolled Competitions</h3>
                {userProfile?.joined_competitions && userProfile.joined_competitions.length > 0 ? (
                  <div className="space-y-2">
                    {userProfile.joined_competitions.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => loadCompetitionDetail(c.id)}
                        className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between hover:border-[#943C1D] transition-colors cursor-pointer"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-[#1F1916]">{c.title}</h4>
                          <span className="text-[11px] text-[#73645A]">Enrolled as: {c.team_name || 'Solo'}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#943C1D]">Go to Workspace &rarr;</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#73645A]">You have not joined any competitions yet.</p>
                )}
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
                <h3 className="font-bold text-lg text-[#1F1916]">Host an AI Benchmark Challenge</h3>
                <p className="text-xs text-[#73645A]">Publish a new Kaggle-style machine learning competition.</p>
              </div>
              <button
                onClick={() => setIsHostModalOpen(false)}
                className="text-[#73645A] hover:text-[#1F1916] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleHostCompetition} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Challenge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Real-Time Fraud & Anomaly Detection Benchmark"
                  value={newCompForm.title}
                  onChange={(e) => setNewCompForm({ ...newCompForm, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g., Identify adversarial credit anomalies under extreme imbalance"
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
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Description & Problem Context</label>
                <textarea
                  rows={3}
                  placeholder="Detail the real-world business context, data inputs, and constraints..."
                  value={newCompForm.description}
                  onChange={(e) => setNewCompForm({ ...newCompForm, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Dataset Overview</label>
                <textarea
                  rows={2}
                  placeholder="Provide dataset schema, training columns, and ground-truth notes..."
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

      {/* MODAL: JOIN COMPETITION */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-bold text-base text-[#1F1916]">Join Competition</h3>
              <button onClick={() => setIsJoinModalOpen(false)} className="text-[#73645A] hover:text-[#1F1916] cursor-pointer">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleJoinCompetition} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Team Name (Optional - leave blank to compete as solo)
                </label>
                <input
                  type="text"
                  placeholder={user?.name ? `${user.name}'s Lab` : 'Solo Competitor'}
                  value={joinTeamName}
                  onChange={(e) => setJoinTeamName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#73645A]">
                By joining, you agree to the challenge rules, deterministic test set validation, and public leaderboard visibility.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer"
                >
                  Confirm & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PREDICTION (Quick modal from top button) */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-bold text-base text-[#1F1916]">Submit to {currentComp?.title}</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-[#73645A] hover:text-[#1F1916] cursor-pointer">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                handleSubmitPrediction(e);
                setIsSubmitModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Submission Title / Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., XGBoost + Feature Selection Fold 3"
                  value={submissionName}
                  onChange={(e) => setSubmissionName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">GitHub / Checkpoint / File URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  value={repoOrFileUrl}
                  onChange={(e) => setRepoOrFileUrl(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional submission details..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer"
                >
                  Evaluate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW DISCUSSION TOPIC */}
      {isNewDiscussionOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-bold text-base text-[#1F1916]">New Discussion Topic</h3>
              <button onClick={() => setIsNewDiscussionOpen(false)} className="text-[#73645A] hover:text-[#1F1916] cursor-pointer">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Simple Baseline 0.85 F1 with CatBoost"
                  value={newDiscTitle}
                  onChange={(e) => setNewDiscTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Tag</label>
                <select
                  value={newDiscTag}
                  onChange={(e) => setNewDiscTag(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3 py-2 text-xs text-[#1F1916] focus:outline-none cursor-pointer"
                >
                  <option value="Baseline">Baseline</option>
                  <option value="EDA">Exploratory Data Analysis (EDA)</option>
                  <option value="Question">Question / Help</option>
                  <option value="Model Tuning">Model Tuning & Hyperparameters</option>
                  <option value="General">General Discussion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">Content / Insights *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share code snippet, findings, or questions with fellow competitors..."
                  value={newDiscContent}
                  onChange={(e) => setNewDiscContent(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDiscussionOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
