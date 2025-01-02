import React from "react";
import ReactDOM from "react-dom";

const Overlay = ({ isOpen, onClose, children } : any) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="bg-gray-800 text-white p-6 rounded-md shadow-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the background
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body // Use a portal to render outside the root element
  );
};

export default Overlay;
