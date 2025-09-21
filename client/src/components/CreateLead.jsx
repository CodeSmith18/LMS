import React, { useState } from "react";
import { createLeadApi } from "../lib/api";
import "./CreateLead.css";

export default function CreateLead({ onDone }) {
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

    if (!form.first_name || !form.last_name || !form.email) {
      setError("First name, last name, and email are required");
      return;
    }

    setLoading(true);
    try {
      await createLeadApi(form);
      setSuccess("✅ Lead created successfully");
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
      if (onDone) onDone();
    } catch (err) {
      setError(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lead-container-rr">
      <h2>Create Lead</h2>
      <form onSubmit={handleSubmit} className="create-lead-form-rr">
        <div>
          <label>First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
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
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
        </div>
        <div>
          <label>Score</label>
          <input name="score" type="number" min={0} max={100} value={form.score} onChange={handleChange} />
        </div>
        <div>
          <label>Lead Value</label>
          <input name="lead_value" type="number" value={form.lead_value} onChange={handleChange} />
        </div>
        <div className="checkbox-row-rr">
          <label>
            <input
              name="is_qualified"
              type="checkbox"
              checked={form.is_qualified}
              onChange={handleChange}
            />{" "}
            Qualified
          </label>
        </div>
        <div className="form-actions-rr">
          <button type="submit" className="primary-btn-rr" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
        {error && <div className="form-error-rr">{error}</div>}
        {success && <div className="form-success-rr">{success}</div>}
      </form>
    </div>
  );
}
