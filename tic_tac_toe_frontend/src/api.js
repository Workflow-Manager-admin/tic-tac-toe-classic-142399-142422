//
// API utility for connecting to Flask backend.
// Adjust the BASE_URL depending on deployed backend location.
//
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

function headers(token) {
  const base = {
    "Content-Type": "application/json"
  };
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  const resp = await fetch(`${BASE_URL}/api/user/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  const resp = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  // Credentials cookie-based if using backend sessions, modify here if JWT is returned
  return resp.json();
}

// PUBLIC_INTERFACE
export async function startGameVSPlayer(token, opponent_username) {
  const resp = await fetch(`${BASE_URL}/api/game/match/vs-player`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ opponent_username }),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function startGameVSAI(token) {
  const resp = await fetch(`${BASE_URL}/api/game/match/vs-ai`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ ai_level: "normal" }),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function makeMove(token, game_id, row, col) {
  const resp = await fetch(`${BASE_URL}/api/game/${game_id}/move`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ row, col }),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getGameHistory(token) {
  const resp = await fetch(`${BASE_URL}/api/game/history`, {
    method: "GET",
    headers: headers(token),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getLeaderboard(token) {
  const resp = await fetch(`${BASE_URL}/api/game/leaderboard`, {
    method: "GET",
    headers: headers(token),
    credentials: "include",
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}
