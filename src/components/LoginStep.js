import React from "react";

const LoginStep = ({ mobile, setMobile, onNext }) => {
  const validateMobile = () => /^[6-9]\d{9}$/.test(mobile);
  const handleNext = () => {
    if (!validateMobile()) {
      alert("Enter valid 10-digit mobile number.");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-blue-300 mb-6">
        Login with Mobile
      </h2>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Enter 10-digit mobile"
        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />
      <button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg text-white font-semibold shadow-lg transition"
      >
        Get OTP
      </button>
    </div>
  );
};

export default LoginStep;
