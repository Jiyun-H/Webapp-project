import React from "react";
import ReactDOM from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/dashboard/Modal.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="modal-children"> {children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
