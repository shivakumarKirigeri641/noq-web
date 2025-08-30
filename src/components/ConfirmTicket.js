import React, { useRef } from "react";
import { useNavigate } from "react-router"; // ✅ import navigation hook
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";

export default function ConfirmTicket() {
  const ticketRef = useRef();
  const navigate = useNavigate(); // ✅ navigation

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
    <div className="flex justify-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md">
        {/* Ticket Card */}
        <div
          ref={ticketRef}
          className="bg-white shadow-lg rounded-2xl p-4 md:p-6 text-gray-900"
        >
          {/* Header */}
          <div className="bg-blue-700 text-white p-3 rounded-xl mb-4 text-center">
            <h2 className="text-lg font-bold">UNRESERVED TICKET</h2>
            <p className="text-xs">Indian Railways</p>
          </div>

          {/* Ticket Body */}
          <div className="space-y-3 text-sm">
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

          {/* Footer */}
          <div className="border-t mt-4 pt-2 text-xs text-gray-500 text-center">
            <p>Booked via {ticketData.bookedBy}</p>
            <p>Please carry valid ID proof while travelling</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
          >
            Download Ticket
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
