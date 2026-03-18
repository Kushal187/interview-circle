const BASE = "/api/auth";

async function loginUser(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function registerUser(username, email, password) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function logoutUser() {
  const res = await fetch(`${BASE}/logout`, { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function checkSession() {
  const res = await fetch(`${BASE}/session`);
  const data = await res.json();
  return data;
}

export { loginUser, registerUser, logoutUser, checkSession };
