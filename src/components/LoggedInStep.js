import React from "react";

const LoggedInStep = ({ onNext, onBack }) => (
  <div className="text-center space-y-3">
    <h2 className="text-lg font-bold text-green-400">
      ✅ Logged in successfully
    </h2>
    <p className="text-sm text-gray-300">
      Welcome back to Anti-Queue Ticketing
    </p>
    <button
      onClick={onNext}
      className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 rounded-lg text-white font-semibold shadow-lg transition"
    >
      Proceed
    </button>
    <button
      onClick={onBack}
      className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium mt-2"
    >
      Back
    </button>
  </div>
);

export default LoggedInStep;
