import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import UpdateLeadForm from "./UpdateLeadForm";
import { fetchLeadsApi, deleteLeadApi } from "../lib/api";
import "./LeadGrid.css";

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
    <div className="leads-grid-container-rr">
      <div className="leads-top-actions-rr">
        <button onClick={() => setShowFilters((s) => !s)} className="secondary-btn-rr">
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button onClick={onCreate} className="primary-btn-rr">Create Lead</button>
      </div>

      {showFilters && (
        <div className="leads-filters-rr">
          <div className="filters-grid-rr">
            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
                <option value="won">Won</option>
              </select>
            </div>
            <div>
              <label>Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">All</option>
                <option value="website">Website</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Referral</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Created From</label>
              <input
                type="date"
                value={createdFrom}
                onChange={(e) => setCreatedFrom(e.target.value)}
                className="date-input"
              />
            </div>
            <div>
              <label>Created To</label>
              <input
                type="date"
                value={createdTo}
                onChange={(e) => setCreatedTo(e.target.value)}
                className="date-input"
              />
            </div>

          </div>

          <div className="filter-actions-rr">
            <button onClick={applyFilters} className="apply-btn-rr">Apply</button>
            <button onClick={clearFilters} className="clear-btn-rr">Clear</button>
            <div className="per-page-rr">
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
          <div className="loading-rr">Loading...</div>
        ) : error ? (
          <div className="error-rr">{error}</div>
        ) : leads.length === 0 ? (
          <div className="no-data-rr">No leads found.</div>
        ) : (
          <div className="leads-grid-rr">
            {leads.map((l) => (
              <div className="lead-card-rr" key={l._id}>
                <div className="lead-card-header-rr">
                  <div>
                    <div className="lead-name-rr">{l.first_name} {l.last_name}</div>
                    <div className="lead-company-rr">{l.company || "-"}</div>
                    <div className={`lead-status-rr status-${l.status}`}>{l.status}</div>
                  </div>
                  
                </div>
                <div className="lead-info-rr">
                  <div><strong>Email:</strong> {l.email}</div>
                  <div><strong>Phone:</strong> {l.phone || "-"}</div>
                  <div><strong>Source:</strong> {l.source}</div>
                  <div><strong>Score:</strong> {l.score ?? "-"}</div>
                  <div><strong>Lead value:</strong> {l.lead_value ?? "-"}</div>
                  <div><strong>Created:</strong> {l.created_at ? new Date(l.created_at).toLocaleString() : "-"}</div>
                </div>
                <div className="lead-card-footer-rr">
                  <div>{l.city || ""} {l.state || ""}</div>
                  <div>
                    <button onClick={() => openUpdate(l)} className="btn-rr">Update</button>
                    <button onClick={() => setConfirmDelete({ open: true, id: l._id })} className="btn-rr danger-rr">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination-rr">
          <button onClick={PrevPage} disabled={page <= 1}>Prev</button>
          <button onClick={NextPage} disabled={page >= totalPages}>Next</button>
          <div>Page {page} of {totalPages} — {total} results</div>
        </div>
      </main>

      <Modal open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <div className="modal-content-rr">
          <h3>Are you sure?</h3>
          <p>This action cannot be undone.</p>
          <div className="modal-actions-rr">
            <button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancel</button>
            <button onClick={() => onDeleteConfirmed(confirmDelete.id)} className="danger-rr">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal open={updateModal.open} onClose={() => setUpdateModal({ open: false, lead: null })}>
        {updateModal.lead && (
          <UpdateLeadForm
            lead={updateModal.lead}
            onDone={onUpdateDone}
            onCancel={() => setUpdateModal({ open: false, lead: null })}
          />
        )}
      </Modal>
    </div>
  );
}
