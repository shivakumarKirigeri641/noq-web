import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useNavigate } from "react-router";

export default function DownloadTicket() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const ticketRef = useRef();

  const ticketData = {
    pnr: "TXN8932749823",
    from: "YESHWANTPUR (YPR)",
    to: "HOWRAH (HWH)",
    train: "PASSENGER",
    class: "General (UR)",
    validTill: "30 Aug 2025, 23:59 hrs",
    passengers: "2 Adults, 1 Child",
    fare: "₹580",
    issuedAt: "30 Aug 2025, 18:20 hrs",
    bookedBy: "NoQ App",
  };

  // Mock OTP send
  const sendOtp = () => {
    setOtpSent(true);
    alert("OTP sent! (For demo, use 1234)");
  };

  // Mock OTP verify
  const verifyOtp = () => {
    if (otp === "1234") {
      setVerified(true);
      setOtpSent(false);
      alert("OTP Verified!");
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  const downloadPDF = async () => {
    const node = ticketRef.current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("UnreservedTicket.pdf");
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Download Ticket</h2>

        {/* Mobile Input */}
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          maxLength={10}
          className={`w-full p-2 border rounded-lg mb-3 
            ${mobile.length === 10 ? "border-green-500" : "border-gray-300"}`}
        />

        {/* Get OTP */}
        <button
          onClick={sendOtp}
          disabled={mobile.length !== 10}
          className={`w-full py-2 rounded-lg mb-3 text-white font-medium 
            ${
              mobile.length === 10
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Get OTP
        </button>

        {/* OTP Input & Verify */}
        {otpSent && (
          <div className="space-y-2 mb-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={4}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={verifyOtp}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={() => {
            navigate("/confirmticket");
          }}
          disabled={!verified}
          className={`w-full py-2 rounded-lg font-medium text-white 
            ${
              verified
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          View Ticket
        </button>

        {/* Hidden Ticket Layout */}
        <div
          ref={ticketRef}
          className="bg-white p-4 mt-6 rounded-xl shadow-lg text-gray-900 hidden"
        >
          <div className="bg-blue-700 text-white p-3 rounded-xl mb-4 text-center">
            <h2 className="text-lg font-bold">UNRESERVED TICKET</h2>
            <p className="text-xs">Indian Railways</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">From</span>
              <span>{ticketData.from}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">To</span>
              <span>{ticketData.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Train</span>
              <span>{ticketData.train}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Class</span>
              <span>{ticketData.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Passengers</span>
              <span>{ticketData.passengers}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Fare</span>
              <span>{ticketData.fare}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Valid Till</span>
              <span>{ticketData.validTill}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Issued At</span>
              <span>{ticketData.issuedAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID</span>
              <span>{ticketData.pnr}</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-2 text-xs text-gray-500 text-center">
            <p>Booked via {ticketData.bookedBy}</p>
            <p>Please carry valid ID proof while travelling</p>
          </div>
        </div>
      </div>
    </div>
  );
}
