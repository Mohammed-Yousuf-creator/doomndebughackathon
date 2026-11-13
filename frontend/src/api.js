// API client for AEGIS FastAPI backend

const API_BASE = "http://localhost:8000/api";

// ---------------- AUTHENTICATION ----------------
export async function loginUser(email, password, roleType) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role_type: roleType })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Authentication failed. Check your role & credentials.");
  }
  return res.json();
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/auth/me?token=${encodeURIComponent(token || "")}`);
  if (!res.ok) return { authenticated: false, user: null };
  return res.json();
}

export async function logoutUser(token) {
  const res = await fetch(`${API_BASE}/auth/logout?token=${encodeURIComponent(token || "")}`, {
    method: "POST"
  });
  return res.json();
}

// ---------------- PARTICIPANT API ----------------
export async function fetchParticipantOverview(userId) {
  const url = userId ? `${API_BASE}/participant/overview?user_id=${encodeURIComponent(userId)}` : `${API_BASE}/participant/overview`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch participant overview");
  return res.json();
}

export async function submitParticipantProject(data) {
  const res = await fetch(`${API_BASE}/participant/submit-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit project");
  return res.json();
}

export async function registerForEvent(eventId, userId, mode = "solo") {
  const res = await fetch(`${API_BASE}/participant/register-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId, user_id: userId, mode })
  });
  if (!res.ok) throw new Error("Failed to register for event");
  return res.json();
}

export async function createTeam(data) {
  const res = await fetch(`${API_BASE}/participant/create-team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create team");
  return res.json();
}

export async function joinTeam(data) {
  const res = await fetch(`${API_BASE}/participant/join-team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to join team");
  }
  return res.json();
}

export async function competeSolo(data) {
  const res = await fetch(`${API_BASE}/participant/compete-solo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to set compete solo mode");
  return res.json();
}

export async function leaveTeam(userId) {
  const res = await fetch(`${API_BASE}/participant/leave-team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error("Failed to leave team");
  return res.json();
}

export async function inviteTeammate(candidateId, userId) {
  const res = await fetch(`${API_BASE}/participant/invite-teammate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidate_id: candidateId, user_id: userId })
  });
  if (!res.ok) throw new Error("Failed to send invitation");
  return res.json();
}

// ---------------- SPRINT & GENERAL ----------------

export async function fetchSprintStatus() {
  const res = await fetch(`${API_BASE}/sprint/status`);
  if (!res.ok) throw new Error("Failed to fetch sprint status");
  return res.json();
}

export async function switchSprintEvent(eventName) {
  const res = await fetch(`${API_BASE}/sprint/switch-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name: eventName })
  });
  if (!res.ok) throw new Error("Failed to switch event");
  return res.json();
}

export async function fetchOrganizerData() {
  const res = await fetch(`${API_BASE}/organizer`);
  if (!res.ok) throw new Error("Failed to fetch organizer data");
  return res.json();
}

export async function registerCheckin(data) {
  const res = await fetch(`${API_BASE}/organizer/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to register checkin");
  return res.json();
}

export async function sendBroadcast(data) {
  const res = await fetch(`${API_BASE}/organizer/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to send broadcast");
  return res.json();
}

export async function dispatchMentor(ticketId, mentorName) {
  const res = await fetch(`${API_BASE}/organizer/dispatch-mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket_id: ticketId, mentor_name: mentorName })
  });
  if (!res.ok) throw new Error("Failed to dispatch mentor");
  return res.json();
}

export async function fetchWarRoom() {
  const res = await fetch(`${API_BASE}/war-room`);
  if (!res.ok) throw new Error("Failed to fetch war room");
  return res.json();
}

export async function createKanbanTask(data) {
  const res = await fetch(`${API_BASE}/war-room/kanban/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create kanban task");
  return res.json();
}

export async function moveKanbanTask(taskId, fromCol, toCol) {
  const res = await fetch(`${API_BASE}/war-room/kanban/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId, from_column: fromCol, to_column: toCol })
  });
  if (!res.ok) throw new Error("Failed to move task");
  return res.json();
}

export async function sendChatMessage(author, text, role = "Builder") {
  const res = await fetch(`${API_BASE}/war-room/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text, role })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function fetchJudgeConsole() {
  const res = await fetch(`${API_BASE}/judge`);
  if (!res.ok) throw new Error("Failed to fetch judge data");
  return res.json();
}

export async function submitEvaluation(projectId, scores, privateNotes, feedback, isDraft = false) {
  const res = await fetch(`${API_BASE}/judge/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: projectId,
      scores,
      private_notes: privateNotes,
      participant_feedback: feedback,
      is_draft: isDraft
    })
  });
  if (!res.ok) throw new Error("Failed to submit evaluation");
  return res.json();
}

export async function fetchSponsorPortal() {
  const res = await fetch(`${API_BASE}/sponsor`);
  if (!res.ok) throw new Error("Failed to fetch sponsor data");
  return res.json();
}

export async function requestInterview(candidateId, notes = "") {
  const res = await fetch(`${API_BASE}/sponsor/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidate_id: candidateId, notes })
  });
  if (!res.ok) throw new Error("Failed to request interview");
  return res.json();
}

export async function submitProposal(packageId, companyName, email, terms = "") {
  const res = await fetch(`${API_BASE}/sponsor/proposal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package_id: packageId, company_name: companyName, contact_email: email, custom_terms: terms })
  });
  if (!res.ok) throw new Error("Failed to submit proposal");
  return res.json();
}

