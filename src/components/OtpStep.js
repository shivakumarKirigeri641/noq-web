import React from "react";
import { addlogin } from "../store/slices/loginSlice";
import { SERVER } from "../utils/constants";
import { useDispatch } from "react-redux";
import axios from "axios";
const OtpStep = ({ otp, setOtp, onNext, onBack, onLogin }) => {
  const dispatch = useDispatch();
  const validateOtp = () => /^\d{4}$/.test(otp);
  const handleNext = async () => {
    if (!validateOtp()) {
      alert("Enter valid 4-digit OTP.");
      return;
    }
    try {
      const result = await axios.post(
        SERVER + "/unreserved-ticket/verifyotp",
        { mobile_number: "9886122415", otp: "1234" },
        { withCredentials: true }
      );
      onNext();
    } catch (err) {
      console.log(err.message);
      alert("Invalid otp! ERror:", err.message);
      onLogin();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-purple-300 mb-6">
        Verify OTP
      </h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 4-digit OTP"
        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
      />
      <button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 py-3 rounded-lg text-white font-semibold shadow-lg transition"
      >
        Verify OTP
      </button>
      <button
        onClick={onBack}
        className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium mt-2"
      >
        Back
      </button>
    </div>
  );
};

export default OtpStep;
