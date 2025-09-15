import React from "react";

const ConfirmTicket = ({ details, onDownload, onHome }) => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6 text-white">
      <h2 className="text-xl font-bold text-green-400 mb-4 text-center">
        🎫 Ticket Confirmed
      </h2>

      <div className="space-y-2 text-sm text-gray-200 mb-6">
        <p>
          <span className="font-semibold">From:</span> {details.source}
        </p>
        <p>
          <span className="font-semibold">To:</span> {details.destination}
        </p>
        <p>
          <span className="font-semibold">Train:</span> {details.train?.name}
        </p>
        <p>
          <span className="font-semibold">Adults:</span> {details.adults}
        </p>
        <p>
          <span className="font-semibold">Children:</span> {details.children}
        </p>
        <p>
          <span className="font-semibold">PH:</span>{" "}
          {details.isPH ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Fare:</span> ₹{details.fare}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onDownload}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm font-semibold"
        >
          ⬇ Download
        </button>
        <button
          onClick={onHome}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-sm font-semibold"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmTicket;
