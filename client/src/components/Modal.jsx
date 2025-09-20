import React from "react";

export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close"><button onClick={onClose}>✕</button></div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
