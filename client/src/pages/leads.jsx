import React, { useEffect, useState } from "react";

export default function Lead(){
  const [view, setView] = useState("list"); // 'list' | 'create'

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <h1>Leads</h1>
          <div className="header-controls">
            <button onClick={() => setView((v) => (v === "list" ? "create" : "list"))} className="primary-btn">
              {view === "list" ? "Create Lead" : "Back to List"}
            </button>
          </div>
        </header>

        {view === "list" ? <LeadsList /> : <CreateLead onDone={() => setView("list")} />}
      </div>
    </div>
  );
}

/* ---------- Leads list (previous App content) ---------- */
function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const [showFilters, setShowFilters] = useState(true);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status", status);
    if (source) params.append("source", source);
    if (createdFrom) params.append("created_from", createdFrom);
    if (createdTo) params.append("created_to", createdTo);
    return params.toString();
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQuery();
      const res = await fetch(`/api/leads?${qs}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setLeads(data.data || []);
      setPage(data.page || 1);
      setLimit(data.limit || 20);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const applyFilters = () => {
    setPage(1);
    fetchLeads();
  };

  const clearFilters = () => {
    setStatus("");
    setSource("");
    setCreatedFrom("");
    setCreatedTo("");
    setPage(1);
    fetchLeads();
  };

  const PrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const NextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div>
      {showFilters && (
        <div className="filters">
          <div className="filters-grid">
            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="qualified">qualified</option>
                <option value="lost">lost</option>
                <option value="won">won</option>
              </select>
            </div>

            <div>
              <label>Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">All</option>
                <option value="website">website</option>
                <option value="facebook_ads">facebook_ads</option>
                <option value="google_ads">google_ads</option>
                <option value="referral">referral</option>
                <option value="events">events</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <label>Created From</label>
              <input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} />
            </div>

            <div>
              <label>Created To</label>
              <input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={applyFilters} className="apply-btn">Apply Filters</button>
            <button onClick={clearFilters} className="clear-btn">Clear</button>
            <div className="per-page">
              <label>Per page</label>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <main>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : leads.length === 0 ? (
          <div className="no-data">No leads found.</div>
        ) : (
          <div className="leads-grid">
            {leads.map((l) => (
              <LeadCard key={l._id} lead={l} />
            ))}
          </div>
        )}

        <div className="pagination">
          <div>
            <button onClick={PrevPage} disabled={page <= 1}>Prev</button>
            <button onClick={NextPage} disabled={page >= totalPages}>Next</button>
          </div>
          <div>
            Page {page} of {totalPages} — {total} results
          </div>
        </div>
      </main>
    </div>
  );
}

function LeadCard({ lead }) {
  return (
    <div className="lead-card">
      <div className="lead-card-header">
        <div>
          <div className="lead-name">{lead.first_name} {lead.last_name}</div>
          <div className="lead-company">{lead.company || "-"}</div>
        </div>
        <div className="lead-status">{lead.status}</div>
      </div>

      <div className="lead-info">
        <div><strong>Email:</strong> {lead.email}</div>
        <div><strong>Phone:</strong> {lead.phone || "-"}</div>
        <div><strong>Source:</strong> {lead.source}</div>
        <div><strong>Score:</strong> {lead.score ?? "-"}</div>
        <div><strong>Lead value:</strong> {lead.lead_value ?? "-"}</div>
        <div><strong>Created:</strong> {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}</div>
      </div>

      <div className="lead-card-footer">
        <div>{lead.city || ""} {lead.state || ""}</div>
        <div><button>View</button></div>
      </div>
    </div>
  );
}

/* ---------- Create Lead Form ---------- */
function CreateLead({ onDone }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // basic validation
    if (!form.first_name || !form.last_name || !form.email) {
      setError("first name, last name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Server error");
      setSuccess("Lead created successfully");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        source: "website",
        status: "new",
        score: 0,
        lead_value: 0,
        is_qualified: false,
      });
      // optional: go back to list after short delay
      setTimeout(() => {
        if (onDone) onDone();
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-form">
      <h2>Create Lead</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>First name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} />
        </div>
        <div>
          <label>Last name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Company</label>
          <input name="company" value={form.company} onChange={handleChange} />
        </div>
        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} />
        </div>
        <div>
          <label>State</label>
          <input name="state" value={form.state} onChange={handleChange} />
        </div>

        <div>
          <label>Source</label>
          <select name="source" value={form.source} onChange={handleChange}>
            <option value="website">website</option>
            <option value="facebook_ads">facebook_ads</option>
            <option value="google_ads">google_ads</option>
            <option value="referral">referral</option>
            <option value="events">events</option>
            <option value="other">other</option>
          </select>
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="qualified">qualified</option>
            <option value="lost">lost</option>
            <option value="won">won</option>
          </select>
        </div>

        <div>
          <label>Score</label>
          <input name="score" type="number" min={0} max={100} value={form.score} onChange={handleChange} />
        </div>

        <div>
          <label>Lead value</label>
          <input name="lead_value" type="number" value={form.lead_value} onChange={handleChange} />
        </div>

        <div className="checkbox-row">
          <label>
            <input name="is_qualified" type="checkbox" checked={form.is_qualified} onChange={handleChange} /> Qualified
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
      </form>
    </div>
  );
}
