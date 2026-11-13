// API client for AEGIS / FORGE (Kaggle Architecture)

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

export async function registerUser(email, password, name, roleType) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role_type: roleType })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Registration failed.");
  }
  return res.json();
}

export async function googleAuthUser(email, name, roleType, googleId, avatarUrl) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, role_type: roleType, google_id: googleId, avatar_url: avatarUrl })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Google authentication failed.");
  }
  return res.json();
}

export async function githubAuthUser(email, name, roleType, githubUsername, avatarUrl) {
  const res = await fetch(`${API_BASE}/auth/github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, role_type: roleType, github_username: githubUsername, avatar_url: avatarUrl })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "GitHub authentication failed.");
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


// ---------------- COMPETITIONS API (KAGGLE STYLE) ----------------

export async function fetchCompetitions(category = "all", search = "") {
  let url = `${API_BASE}/competitions?category=${encodeURIComponent(category)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load competitions.");
  return res.json();
}

export async function fetchCompetitionById(compId, userId = null) {
  const url = userId 
    ? `${API_BASE}/competitions/${encodeURIComponent(compId)}?user_id=${encodeURIComponent(userId)}`
    : `${API_BASE}/competitions/${encodeURIComponent(compId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Competition not found.");
  return res.json();
}

export async function createCompetition(data) {
  const res = await fetch(`${API_BASE}/competitions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create competition.");
  }
  return res.json();
}

export async function joinCompetition(compId, userId, teamName = null) {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, team_name: teamName })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to join competition.");
  }
  return res.json();
}

export async function submitPrediction(compId, userId, submissionName, repoOrFileUrl, notes = "") {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      submission_name: submissionName,
      repo_or_file_url: repoOrFileUrl,
      notes: notes
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to evaluate submission.");
  }
  return res.json();
}

export async function fetchLeaderboard(compId) {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard.");
  return res.json();
}

export async function fetchUserSubmissions(compId, userId) {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/submissions?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to fetch past submissions.");
  return res.json();
}


// ---------------- DISCUSSIONS & COMMUNITY ----------------

export async function fetchDiscussions(compId) {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/discussions`);
  if (!res.ok) throw new Error("Failed to fetch discussions.");
  return res.json();
}

export async function createDiscussion(compId, authorId, title, content, tag = "General") {
  const res = await fetch(`${API_BASE}/competitions/${encodeURIComponent(compId)}/discussions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author_id: authorId,
      title: title,
      content: content,
      tag: tag
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create discussion topic.");
  }
  return res.json();
}

export async function addComment(discId, authorId, content) {
  const res = await fetch(`${API_BASE}/discussions/${encodeURIComponent(discId)}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author_id: authorId, content: content })
  });
  if (!res.ok) throw new Error("Failed to post comment.");
  return res.json();
}

export async function upvoteDiscussion(discId) {
  const res = await fetch(`${API_BASE}/discussions/${encodeURIComponent(discId)}/upvote`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to upvote.");
  return res.json();
}


// ---------------- PROFILE & ORGANIZER DASHBOARD ----------------

export async function fetchUserProfile(userId) {
  const res = await fetch(`${API_BASE}/user/profile?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to fetch profile.");
  return res.json();
}

export async function saveOnboardingProfile(payload) {
  const res = await fetch(`${API_BASE}/participant/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update profile.");
  }
  return res.json();
}

export async function updateUserProfile(payload) {
  return saveOnboardingProfile(payload);
}

export async function fetchOrganizerDashboard(hostId = "u-org-1") {
  const res = await fetch(`${API_BASE}/organizer/dashboard?host_id=${encodeURIComponent(hostId)}`);
  if (!res.ok) throw new Error("Failed to fetch organizer dashboard.");
  return res.json();
}

export async function resetSystemData(mode = "clean") {
  const res = await fetch(`${API_BASE}/organizer/reset-data?mode=${mode}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to reset system data.");
  return res.json();
}
