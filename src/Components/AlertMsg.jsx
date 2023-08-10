import React from "react";

const AlertMsg = ({ status, icon, msg }) => {
  const alertColors = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg ${
        alertColors[status || "info"]
      }`}
      role="alert"
    >
      {icon && (
        <svg
          className="flex-shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {icon}
        </svg>
      )}
      <span className="sr-only">Info</span>
      <div className="ml-3 text-sm font-medium">{msg}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 ${
          alertColors[status || "info"]
        } rounded-lg focus:ring-2 p-1.5 hover:bg-opacity-80 inline-flex items-center justify-center h-8 w-8`}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default AlertMsg;
