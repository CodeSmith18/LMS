import React, { useState } from "react";
import { createLeadApi } from "../lib/api";

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
      setError("first name, last name and email are required");
      return;
    }

    setLoading(true);
    try {
      const data = await createLeadApi(form);
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
      // call parent
      if (onDone) onDone();
    } catch (err) {
      setError(err.message || "Create failed");
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
