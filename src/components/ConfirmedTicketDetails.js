import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

const ConfirmedTicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef(null);

  const ticketdata = location.state?.ticketdata || null;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(ticketdata?.data);
        setTicket(ticketdata?.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketdata]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Confirmed Ticket", 20, y);
    y += 15;

    doc.setFontSize(12);
    doc.text(`PNR: ${ticket.ticket_details.pnr}`, 20, y);
    y += 10;
    doc.text(
      `Train: ${ticket.train_details.train_name} (${ticket.train_details.train_number})`,
      20,
      y
    );
    y += 10;
    doc.text(`From: ${ticket.train_details.source}`, 20, y);
    y += 10;
    doc.text(`To: ${ticket.train_details.destination}`, 20, y);
    y += 10;
    doc.text(
      `Date: ${
        ticket.ticket_details.ticket_confirmation_datetime.split("T")[0]
      }`,
      20,
      y
    );
    y += 10;

    doc.text(`Fare: ₹${ticket.pay_details.total_fare}`, 20, y);
    y += 10;
    doc.text(`Payment Type: ${ticket.pay_details.paytype}`, 20, y);
    y += 10;

    doc.text(`Booking Details:`, 20, y);
    y += 8;
    doc.text(`  Adults: ${ticket.booking_details.adults}`, 25, y);
    y += 8;
    doc.text(`  Children: ${ticket.booking_details.children}`, 25, y);
    y += 8;
    doc.text(
      `  Physically Handicapped: ${
        ticket.booking_details.physically_handicapped ? "Yes" : "No"
      }`,
      25,
      y
    );
    y += 10;

    // ✅ Generate QR Code for TT verification
    const ticketURL = `http://localhost:8888/unreserved-ticket/tt-data/verify-ticket/:${ticket.ticket_details.pnr}`;
    /*const qrDataUrl = await QRCode.toDataURL(ticketURL);
    doc.addImage(qrDataUrl, "PNG", 150, 40, 40, 40);*/

    // ✅ Footer comments
    doc.setFontSize(10);
    y = 270;
    ticket.comments?.forEach((comment, index) => {
      doc.text(comment, 20, y + index * 6);
    });

    doc.save(`Ticket_${ticket.ticket_details.pnr}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Ticket details not found.</p>
      </div>
    );
  }
  const ticketURL = `http://localhost:8888/unreserved-ticket/tt-data/verify-ticket/:${ticket?.ticket_details?.pnr}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center px-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        ref={ticketRef}
      >
        {/* Ticket Header */}
        <div className="bg-blue-600 p-4 text-white text-center">
          <h2 className="font-bold text-lg">
            {ticket?.train_details?.train_name}
          </h2>
          <p className="text-sm">PNR: {ticket?.ticket_details?.pnr}</p>
        </div>

        <div className="p-4 space-y-3">
          {/* Route */}
          <div className="border-b border-dotted pb-2">
            <p className="text-sm text-gray-500">Route</p>
            <p className="font-semibold">
              {ticket?.train_details?.source} →{" "}
              {ticket?.train_details?.destination}
            </p>
          </div>

          {/* Date & Fare */}
          <div className="border-b border-dotted pb-2 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Date of Journey</p>
              <p>
                {
                  ticket?.ticket_details?.ticket_confirmation_datetime.split(
                    "T"
                  )[0]
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Fare</p>
              <p className="font-semibold text-blue-600">
                ₹{ticket?.pay_details?.total_fare}
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="border-b border-dotted pb-2">
            <p className="text-sm text-gray-500">Passengers</p>
            <p>
              Adults: {ticket.booking_details?.adults}, Children:{" "}
              {ticket.booking_details?.children}, PH:{" "}
              {ticket?.booking_details?.physically_handicapped?.isPH
                ? "Yes"
                : "No"}
            </p>
          </div>

          {/* Train Number & QR */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Train Number</p>
              <p>{ticket?.train_details?.train_number}</p>
            </div>
            <QRCodeSVG value={ticketURL} size={64} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between p-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
          >
            Home
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedTicketDetails;
