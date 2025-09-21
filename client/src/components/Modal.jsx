import React from "react";
import "./ModalUnique.css"; // new unique CSS file

export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modalunique-backdrop" onClick={onClose}>
      <div className="modalunique-box" onClick={(e) => e.stopPropagation()}>
        <div className="modalunique-close">
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modalunique-content">{children}</div>
      </div>
    </div>
  );
}
