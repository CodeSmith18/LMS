import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import UpdateLeadForm from "./UpdateLeadForm";
import { fetchLeadsApi, deleteLeadApi } from "../lib/api";

export default function LeadsGrid({ onCreate }) {
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

  // modal state
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [updateModal, setUpdateModal] = useState({ open: false, lead: null });

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

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQuery();
      const data = await fetchLeadsApi(qs);
      setLeads(data.data || []);
      setPage(data.page || 1);
      setLimit(data.limit || 20);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const applyFilters = () => {
    setPage(1);
    load();
  };

  const clearFilters = () => {
    setStatus("");
    setSource("");
    setCreatedFrom("");
    setCreatedTo("");
    setPage(1);
    load();
  };

  const PrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const NextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const onDeleteConfirmed = async (id) => {
    try {
      await deleteLeadApi(id);
      setConfirmDelete({ open: false, id: null });
      // refresh current page
      load();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const openUpdate = (lead) => setUpdateModal({ open: true, lead });

  const onUpdateDone = () => {
    setUpdateModal({ open: false, lead: null });
    load();
  };

  return (
    <div>
      <div className="top-actions">
        <button onClick={() => setShowFilters((s) => !s)} className="secondary-btn">
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div style={{ marginLeft: 10 }}>
          <button onClick={onCreate} className="primary-btn">Create Lead</button>
        </div>
      </div>

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
              <div className="lead-card" key={l._id}>
                <div className="lead-card-header">
                  <div>
                    <div className="lead-name">{l.first_name} {l.last_name}</div>
                    <div className="lead-company">{l.company || "-"}</div>
                  </div>
                  <div className="lead-status">{l.status}</div>
                </div>

                <div className="lead-info">
                  <div><strong>Email:</strong> {l.email}</div>
                  <div><strong>Phone:</strong> {l.phone || "-"}</div>
                  <div><strong>Source:</strong> {l.source}</div>
                  <div><strong>Score:</strong> {l.score ?? "-"}</div>
                  <div><strong>Lead value:</strong> {l.lead_value ?? "-"}</div>
                  <div><strong>Created:</strong> {l.created_at ? new Date(l.created_at).toLocaleString() : "-"}</div>
                </div>

                <div className="lead-card-footer">
                  <div>{l.city || ""} {l.state || ""}</div>
                  <div>
                    <button onClick={() => openUpdate(l)} className="btn">Update</button>
                    <button onClick={() => setConfirmDelete({ open: true, id: l._id })} className="btn danger">Delete</button>
                  </div>
                </div>
              </div>
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

      {/* Delete confirmation modal */}
      <Modal open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <div style={{ padding: 12 }}>
          <h3>Are you sure?</h3>
          <p>You are about to delete this lead. This action cannot be undone.</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancel</button>
            <button onClick={() => onDeleteConfirmed(confirmDelete.id)} className="danger">Yes, delete</button>
          </div>
        </div>
      </Modal>

      {/* Update modal */}
      <Modal open={updateModal.open} onClose={() => setUpdateModal({ open: false, lead: null })}>
        {updateModal.lead && (
          <UpdateLeadForm lead={updateModal.lead} onDone={onUpdateDone} onCancel={() => setUpdateModal({ open: false, lead: null })} />
        )}
      </Modal>
    </div>
  );
}
