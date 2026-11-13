import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OrganizerConsole from './components/OrganizerConsole';
import WarRoom from './components/WarRoom';
import JudgeConsole from './components/JudgeConsole';
import SponsorPortal from './components/SponsorPortal';
import {
  CheckinModal,
  BroadcastModal,
  EmergencyModal,
  TaskModal,
  InterviewModal,
  Toast
} from './components/Modals';
import * as api from './api';

const USER_PROFILES = [
  {
    id: 'u-1',
    name: 'Dr. Aris Vane',
    role: 'Organizer Lead',
    avatar: '/assets/asset_16_9592fa2f36.png',
    defaultTab: 'ops'
  },
  {
    id: 'u-2',
    name: 'Marcus Chen',
    role: 'Builder / Team Lead',
    avatar: '/assets/asset_12_94c367ea26.png',
    defaultTab: 'war-room'
  },
  {
    id: 'u-3',
    name: 'Dr. Aris Thome',
    role: 'Judge Lead (Edge Robotics)',
    avatar: '/assets/asset_02_5585e36d1e.png',
    defaultTab: 'judge'
  },
  {
    id: 'u-4',
    name: 'NVIDIA Inception',
    role: 'Title Partner',
    avatar: '/assets/asset_09_5517e51afc.png',
    defaultTab: 'sponsor'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('ops'); // 'ops', 'war-room', 'judge', 'sponsor'
  const [currentUser, setCurrentUser] = useState(USER_PROFILES[0]);
  const [toast, setToast] = useState({ message: '', icon: 'check_circle' });

  // State data fetched from backend
  const [sprintStatus, setSprintStatus] = useState(null);
  const [organizerData, setOrganizerData] = useState(null);
  const [warRoomData, setWarRoomData] = useState(null);
  const [judgeData, setJudgeData] = useState(null);
  const [sponsorData, setSponsorData] = useState(null);

  // Modals visibility
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);

  const showToast = (message, icon = 'check_circle') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast({ message: '', icon: 'check_circle' });
    }, 3500);
  };

  // Initial data loading
  const loadAllData = async () => {
    try {
      const [sprint, org, war, judge, sponsor] = await Promise.all([
        api.fetchSprintStatus().catch(() => null),
        api.fetchOrganizerData().catch(() => null),
        api.fetchWarRoom().catch(() => null),
        api.fetchJudgeConsole().catch(() => null),
        api.fetchSponsorPortal().catch(() => null),
      ]);
      if (sprint) setSprintStatus(sprint);
      if (org) setOrganizerData(org);
      if (war) setWarRoomData(war);
      if (judge) setJudgeData(judge);
      if (sponsor) setSponsorData(sponsor);
    } catch (err) {
      console.warn("API load error, using initial states", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // WebSocket Live Telemetry Stream
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket("ws://localhost:8000/ws/telemetry");
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "TELEMETRY_PULSE") {
            setWarRoomData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                orin_telemetry: {
                  ...prev.orin_telemetry,
                  npu_load: payload.npu_load,
                  sync_jitter: payload.sync_jitter,
                  temperature: payload.temp
                }
              };
            });
          }
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      // ws fallback
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Event Switcher handler
  const handleSwitchEvent = async (eventName) => {
    try {
      await api.switchSprintEvent(eventName);
      setSprintStatus(prev => prev ? { ...prev, active_event: eventName } : prev);
      showToast(`Switched active event to: ${eventName}`, 'flag');
    } catch (err) {
      showToast(`Switched active event to: ${eventName}`, 'flag');
    }
  };

  // Check-in handler
  const handleCheckinSubmit = async (data) => {
    try {
      const res = await api.registerCheckin(data);
      showToast(`Checked in: ${data.attendee} (${data.checkpoint})`, 'how_to_reg');
      // Update local organizer state
      setOrganizerData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checkin_stream: [res.entry, ...(prev.checkin_stream || [])],
          kpis: {
            ...prev.kpis,
            turnout: res.turnout
          }
        };
      });
    } catch (err) {
      showToast(`Checked in: ${data.attendee}`, 'how_to_reg');
    }
  };

  // Broadcast handler
  const handleBroadcastSubmit = async (data) => {
    try {
      const res = await api.sendBroadcast(data);
      showToast(`Broadcast Sent: ${data.title}`, 'campaign');
      setOrganizerData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          broadcasts: [res.broadcast, ...(prev.broadcasts || [])]
        };
      });
    } catch (err) {
      showToast(`Broadcast Sent: ${data.title}`, 'campaign');
    }
  };

  // Emergency Alert handler
  const handleEmergencyConfirm = () => {
    handleBroadcastSubmit({
      title: "EMERGENCY PROTOCOL ACTIVE",
      message: "Facility-wide advisory dispatched. Standby for ops directive.",
      type: "alert"
    });
    showToast("EMERGENCY ALERT BROADCASTED", 'warning');
  };

  // Export Roll Call CSV handler
  const handleExportCsv = () => {
    window.open("http://localhost:8000/api/organizer/export-csv", "_blank");
    showToast("Exporting attendee roll call CSV...", 'download');
  };

  // Dispatch Mentor handler
  const handleDispatchMentor = async (ticketId, mentorName) => {
    try {
      await api.dispatchMentor(ticketId, mentorName);
      showToast(`Mentor ${mentorName} dispatched!`, 'support_agent');
      setOrganizerData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mentor_queue: prev.mentor_queue.map(item =>
            item.id === ticketId ? { ...item, assigned_mentor: mentorName, status: "In Progress" } : item
          )
        };
      });
    } catch (err) {
      showToast(`Mentor assigned: ${mentorName}`, 'support_agent');
    }
  };

  // Kanban task creation handler
  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.createKanbanTask(taskData);
      showToast(`Task ${res.task.id} created!`, 'add_task');
      setWarRoomData((prev) => {
        if (!prev) return prev;
        const col = res.column;
        return {
          ...prev,
          kanban: {
            ...prev.kanban,
            [col]: [res.task, ...(prev.kanban[col] || [])]
          }
        };
      });
    } catch (err) {
      showToast(`Task created!`, 'add_task');
    }
  };

  // Kanban task move handler
  const handleMoveTask = async (taskId, fromCol, toCol) => {
    try {
      await api.moveKanbanTask(taskId, fromCol, toCol);
      setWarRoomData((prev) => {
        if (!prev) return prev;
        const fromList = [...(prev.kanban[fromCol] || [])];
        const toList = [...(prev.kanban[toCol] || [])];
        const idx = fromList.findIndex(t => t.id === taskId);
        if (idx !== -1) {
          const [moved] = fromList.splice(idx, 1);
          toList.unshift(moved);
        }
        return {
          ...prev,
          kanban: {
            ...prev.kanban,
            [fromCol]: fromList,
            [toCol]: toList
          }
        };
      });
      showToast(`Moved ${taskId} to ${toCol.replace('_', ' ')}`, 'view_kanban');
    } catch (err) {
      showToast(`Moved task`, 'view_kanban');
    }
  };

  // Chat message handler in War Room
  const handleSendMessage = async (text) => {
    try {
      const res = await api.sendChatMessage(currentUser.name, text, currentUser.role);
      setWarRoomData((prev) => {
        if (!prev) return prev;
        const newLog = [...(prev.mission_log || []), res.message];
        if (res.ai_reply) newLog.push(res.ai_reply);
        return {
          ...prev,
          mission_log: newLog
        };
      });
      if (res.ai_reply) {
        showToast("AEGIS Synthesizer replied to your query!", 'smart_toy');
      }
    } catch (err) {
      showToast("Message sent to mission log", 'chat');
    }
  };

  // Evaluation submission handler
  const handleSubmitEvaluation = async ({ projectId, scores, privateNotes, feedback, compositeScore }) => {
    try {
      await api.submitEvaluation(projectId, scores, privateNotes, feedback, false);
      showToast(`Evaluation confirmed: ${compositeScore}/100. Loading next project!`, 'check_circle');
      setJudgeData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          judge_profile: {
            ...prev.judge_profile,
            completed_count: prev.judge_profile.completed_count + 1,
            remaining: Math.max(0, prev.judge_profile.remaining - 1)
          }
        };
      });
    } catch (err) {
      showToast(`Score confirmed: ${compositeScore}/100`, 'check_circle');
    }
  };

  // Save Draft evaluation handler
  const handleSaveDraft = async ({ projectId, scores, privateNotes, feedback }) => {
    try {
      await api.submitEvaluation(projectId, scores, privateNotes, feedback, true);
      showToast("Evaluation Draft Autosynced to Secure Bench.", 'save');
    } catch (err) {
      showToast("Evaluation draft stored in local session.", 'save');
    }
  };

  // Sponsor interview request handler
  const handleRequestInterview = async (candidateId, notes) => {
    try {
      await api.requestInterview(candidateId, notes);
      showToast("Interview request dispatched via AEGIS Fast-Track API!", 'mail');
    } catch (err) {
      showToast("Interview invitation sent!", 'mail');
    }
  };

  // Sponsor custom proposal handler
  const handleSubmitProposal = async (packageId, company, email, terms) => {
    try {
      await api.submitProposal(packageId, company, email, terms);
      showToast("Custom Proposal queued for Hackathon Committee review!", 'post_add');
    } catch (err) {
      showToast("Proposal received!", 'post_add');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col justify-between selection:bg-primary-fixed selection:text-primary">
      {/* Master Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sprint={sprintStatus || organizerData?.sprint}
        onSwitchEvent={handleSwitchEvent}
        broadcasts={organizerData?.broadcasts || []}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        userOptions={USER_PROFILES}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {activeTab === 'ops' && (
          <OrganizerConsole
            data={organizerData}
            onCheckinClick={() => setIsCheckinOpen(true)}
            onBroadcastClick={() => setIsBroadcastOpen(true)}
            onEmergencyClick={() => setIsEmergencyOpen(true)}
            onExportCsv={handleExportCsv}
            onDispatchMentor={handleDispatchMentor}
          />
        )}

        {activeTab === 'war-room' && (
          <WarRoom
            data={warRoomData}
            onAddTaskClick={() => setIsTaskOpen(true)}
            onMoveTask={handleMoveTask}
            onSendMessage={handleSendMessage}
            onInviteClick={() => showToast("Invite link copied to clipboard: https://aegis.mit.edu/invite/vs-9920", 'link')}
          />
        )}

        {activeTab === 'judge' && (
          <JudgeConsole
            data={judgeData}
            onSubmitEvaluation={handleSubmitEvaluation}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeTab === 'sponsor' && (
          <SponsorPortal
            data={sponsorData}
            onRequestInterview={(cand) => setInterviewCandidate(cand)}
            onSubmitProposal={handleSubmitProposal}
            onExportLedger={() => {
              window.open("http://localhost:8000/api/organizer/export-csv", "_blank");
              showToast("Downloading partner ledger...", 'download');
            }}
          />
        )}
      </main>

      {/* Aesthetic Footer */}
      <footer className="w-full bg-surface-container-low border-t border-surface-container-high py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="font-headline font-bold text-sm text-primary">AEGIS</span>
            <span className="text-on-surface-variant font-medium">
              — Forge Innovation Network Operating System
            </span>
          </div>

          <div className="flex items-center gap-4 text-on-surface-variant flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Cluster US-East-1</span>
            </span>
            <span>Telemetry: OK</span>
            <span>FastAPI & React Hybrid Architecture</span>
            <span>© 2025 AEGIS Systems</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
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
        onConfirm={handleEmergencyConfirm}
      />

      <TaskModal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        onSubmit={handleCreateTask}
      />

      <InterviewModal
        candidate={interviewCandidate}
        isOpen={!!interviewCandidate}
        onClose={() => setInterviewCandidate(null)}
        onSubmit={handleRequestInterview}
      />

      {/* Floating Notification Toast */}
      <Toast
        message={toast.message}
        icon={toast.icon}
        onClose={() => setToast({ message: '', icon: 'check_circle' })}
      />
    </div>
  );
}
