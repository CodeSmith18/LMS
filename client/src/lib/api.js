const backendUrl = import.meta.env.VITE_BACKEND_URL;
export async function fetchLeadsApi(qs = "") {
  const res = await fetch(`${backendUrl}/api/leads?${qs}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server returned ${res.status}`);
  }
  return res.json();
}

export async function createLeadApi(payload) {
  const res = await fetch(`${backendUrl}/api/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Server returned ${res.status}`);
  return data;
}

export async function deleteLeadApi(id) {
  const res = await fetch(`${backendUrl}/api/leads/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server returned ${res.status}`);
  }
  return res.json();
}

export async function updateLeadApi(id, payload) {
  const res = await fetch(`${backendUrl}/api/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Server returned ${res.status}`);
  return data;
}
