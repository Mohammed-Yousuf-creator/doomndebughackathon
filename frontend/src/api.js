// API client for AEGIS FastAPI backend

const API_BASE = "http://localhost:8000/api";

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

