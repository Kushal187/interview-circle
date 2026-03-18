const BASE = "/api/signals";

async function fetchSignals(experienceId) {
  const res = await fetch(`${BASE}/${experienceId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function createSignal(experienceId, helpful, outdated) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experienceId, helpful, outdated }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function updateSignal(experienceId, updates) {
  const res = await fetch(`${BASE}/${experienceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function deleteSignal(experienceId) {
  const res = await fetch(`${BASE}/${experienceId}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export { fetchSignals, createSignal, updateSignal, deleteSignal };
