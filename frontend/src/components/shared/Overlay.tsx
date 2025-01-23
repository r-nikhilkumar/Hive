import React from "react";
import ReactDOM from "react-dom";

const Overlay = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-dark-2 p-4 rounded shadow-lg w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Overlay;
