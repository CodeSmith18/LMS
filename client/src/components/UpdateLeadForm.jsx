import React, { useState } from "react";
import { updateLeadApi } from "../lib/api";
import "./Update.css";

export default function UpdateLeadForm({ lead, onDone, onCancel }) {
  const [form, setForm] = useState({ ...lead });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateLeadApi(lead._id, form);
      if (onDone) onDone();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updatelead-container">
      <h3 className="updatelead-title">Update Lead</h3>
      <form onSubmit={handleSubmit} className="updatelead-grid">
        <div>
          <label>First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="updatelead-input"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="updatelead-input"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="updatelead-input"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="updatelead-input"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="updatelead-input"
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="qualified">qualified</option>
            <option value="lost">lost</option>
            <option value="won">won</option>
          </select>
        </div>

        <div className="updatelead-actions">
          <button type="button" onClick={onCancel} className="updatelead-cancel">
            Cancel
          </button>
          <button
            type="submit"
            className="updatelead-save"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {error && <div className="updatelead-error">{error}</div>}
      </form>
    </div>
  );
}
