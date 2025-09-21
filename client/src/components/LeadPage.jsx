import React, { useState } from "react";
import LeadsGrid from "./LeadGrid";
import CreateLead from "./CreateLead";
import "./LeadPage.css";

export default function LeadPage() {
  const [view, setView] = useState("list");

  return (
    <div className="leadpage-container">
      <div className="leadpage-wrapper">
        <header className="leadpage-header">
          <h1 className="leadpage-title">Leads</h1>
          <div className="leadpage-controls">
            <button
              onClick={() => setView((v) => (v === "list" ? "create" : "list"))}
              className="leadpage-btn"
            >
              {view === "list" ? "➕ Create Lead" : "⬅ Back to List"}
            </button>
          </div>
        </header>

        {view === "list" ? (
          <LeadsGrid onCreate={() => setView("create")} />
        ) : (
          <CreateLead onDone={() => setView("list")} />
        )}
      </div>
    </div>
  );
}
