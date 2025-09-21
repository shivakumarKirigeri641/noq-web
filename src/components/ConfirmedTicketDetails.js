import React, { useEffect, useState, useRef } from "react";
import { SERVER } from "../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import Cookies from "js-cookie";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
// Named import
import * as QRCode from "qrcode";

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

    const doc = new jsPDF("p", "mm", [180, 250]); // small A6-like card

    // Header
    doc.setFillColor(29, 78, 216); // blue background
    doc.rect(0, 0, 180, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(ticket.train_details.train_name, 90, 10, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`PNR: ${ticket.ticket_details.pnr}`, 90, 20, { align: "center" });

    // Body
    doc.setTextColor(0, 0, 0);
    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.text("Route", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${ticket.train_details.source} → ${ticket.train_details.destination}`,
      10,
      y + 7
    );

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Date of Journey", 10, y);
    doc.text("Total Fare", 120, y, { align: "left" });
    doc.setFont("helvetica", "normal");
    doc.text(
      new Date(ticket.ticket_details.ticket_confirmation_datetime)
        .toISOString()
        .split("T")[0],
      10,
      y + 7
    );
    doc.text(`₹${ticket.pay_details.total_fare}`, 120, y + 7);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Scheduled departure", 10, y);
    doc.setFont("helvetica", "normal");
    const dep = ticket.ticket_details.scheduled_departure;
    doc.text(
      `${dep.hours.toString().padStart(2, "0")}:${
        !dep?.minute ? "00" : dep?.minute
      }`,
      10,
      y + 7
    );

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Passengers", 10, y);
    doc.setFont("helvetica", "normal");
    const b = ticket.booking_details;
    doc.text(
      `Adults: ${b.adults}, Children: ${b.children}, PH: ${
        b.physically_handicapped ? "Yes" : "No"
      }`,
      10,
      y + 7
    );

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Train Number", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(ticket.train_details.train_number, 10, y + 7);

    // QR code
    const ticketURL =
      SERVER +
      "/unreserved-ticket/tt-data/verify-ticket/:" +
      ticket.ticket_details.pnr;
    try {
      const qrDataUrl = await QRCode.toDataURL(ticketURL, {
        width: 50,
        margin: 1,
      });
      doc.addImage(qrDataUrl, "PNG", 130, 60, 40, 40);
    } catch (err) {
      console.error("QR code generation failed:", err);
    }

    // Comments at bottom
    let footY = 200;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    ticket.comments.forEach((c) => {
      doc.text(`* ${c}`, 10, footY);
      footY += 5;
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
              {ticket?.train_details?.source}{" "}
              <span className="text-gray-700"> to </span>
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

          {/* scheduled departure */}
          <div className="border-b border-dotted pb-2 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Scheduled departure</p>
              <div className="flex">
                <p>{ticket?.ticket_details?.scheduled_departure?.hours}</p>
                <span>:</span>
                <p>
                  {!ticket?.ticket_details?.scheduled_departure?.minutes
                    ? "00"
                    : ticket?.ticket_details?.scheduled_departure?.minutes}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ticket status</p>
              <div className="flex">
                <p>
                  {ticket?.ticket_details?.pnr_status === 0 ? (
                    <span className="py-0.5 text-green-600 font-bold">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="py-0.5 text-red-600 font-bold">
                      EXPIRED
                    </span>
                  )}
                </p>
              </div>
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
            onClick={() => {
              const token = Cookies.get("token");
              if (!token) {
                alert("Session expired, please re-login!");
                navigate("/"); // redirect to login
                return;
              } else {
                navigate("/menu");
              }
            }}
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
