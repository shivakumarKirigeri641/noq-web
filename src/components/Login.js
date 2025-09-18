import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router";
import axios from "axios";
import { Slide, Fade } from "react-awesome-reveal";
export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isMobileValid = /^[6-9]\d{9}$/.test(mobile);
  const isOtpValid = /^\d{4,6}$/.test(otp);

  const handleGetOtp = async () => {
    if (!isMobileValid) return;
    setLoading(true);
    setError("");

    try {
      console.log(process.env.REACT_APP_SERVER);
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/unreserved-ticket/send-otp`,
        {
          mobile_number: mobile,
        },
        { withCredentials: true }
      );
      setOtpSent(true);
      if (res.data.success) {
        setOtpSent(true);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Error sending OTP. Try again. Error:", err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        process.env.REACT_APP_process.env.REACT_APP_SERVER +
          "/unreserved-ticket/verifyotp",
        {
          mobile_number: mobile,
          otp: otp,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/menu");
      } else {
        setError(res.data.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
      setError("Error verifying OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER);
  }, []);
  return (
    <Layout>
      <div className="relative flex flex-col justify-center items-center h-screen w-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606122101045-78e0b57a6f57?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-orange-700/70" />

        {/* Login Card */}
        <div className="relative w-[360px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h1 className="text-xl font-bold text-center mb-2 text-gray-800">
            Welcome to ServePe App Solutions
          </h1>
          <p className="text-sm text-center text-gray-600 mb-6">
            One stop for unreserved ticketing.
          </p>

          {/* Show error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          {/* Mobile Input */}
          {!otpSent && !loading && (
            <Fade triggerOnce>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Mobile Number"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isMobileValid ? "border-green-400" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4`}
              />
              {!isMobileValid && mobile.length > 0 && (
                <p className="text-red-500 text-sm mb-2">
                  Enter valid 10 digit number
                </p>
              )}
              <button
                onClick={handleGetOtp}
                disabled={!isMobileValid}
                className={`w-full py-3 rounded-lg text-white font-medium transition ${
                  isMobileValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Get OTP
              </button>
            </Fade>
          )}

          {/* OTP Input */}
          {otpSent && !loading && (
            <Slide direction="up" triggerOnce>
              <div className="mt-6">
                <input
                  type="tel"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isOtpValid ? "border-green-400" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4`}
                />
                {!isOtpValid && otp.length > 0 && (
                  <p className="text-red-500 text-sm mb-2">
                    OTP must be 4–6 digits
                  </p>
                )}
                <button
                  onClick={handleVerifyOtp}
                  disabled={!isOtpValid}
                  className={`w-full py-3 rounded-lg text-white font-medium transition ${
                    isOtpValid
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>
              </div>
            </Slide>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-700 font-medium">
                Please wait, processing...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-3 text-center text-white text-xs">
          © {new Date().getFullYear()} ServePe App Solutions. All rights
          reserved.
        </footer>
      </div>
    </Layout>
  );
}
