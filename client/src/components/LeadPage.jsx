import React, { useState } from "react";
import LeadsGrid from "./LeadGrid";
import CreateLead from "./CreateLead";
import "../styles/leads.css";


export default function LeadPage() {
    const [view, setView] = useState("list"); 

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <header className="header">
                    <h1>Leads</h1>
                    <div className="header-controls">
                        <button
                            onClick={() => setView((v) => (v === "list" ? "create" : "list"))}
                            className="primary-btn"
                        >
                            {view === "list" ? "Create Lead" : "Back to List"}
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