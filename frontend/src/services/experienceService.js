const BASE = "/api/experiences";

async function fetchExperiences(params = {}) {
  const query = new URLSearchParams();
  if (params.company) query.set("company", params.company);
  if (params.role) query.set("role", params.role);
  if (params.round) query.set("round", params.round);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const res = await fetch(`${BASE}?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function fetchExperienceById(id) {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function fetchMyExperiences() {
  const res = await fetch(`${BASE}/mine/list`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function createExperience(body) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function updateExperience(id, body) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function deleteExperience(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function fetchFacets() {
  const res = await fetch(`${BASE}/facets`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export {
  fetchExperiences,
  fetchExperienceById,
  fetchMyExperiences,
  fetchFacets,
  createExperience,
  updateExperience,
  deleteExperience,
};
