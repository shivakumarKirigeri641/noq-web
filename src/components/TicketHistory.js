import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { SERVER } from "../utils/constants";
import "react-toastify/dist/ReactToastify.css";
import { useSprings, animated } from "react-spring";
import { Fade } from "react-awesome-reveal";

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPNRs, setExpandedPNRs] = useState(new Set());

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          SERVER + "/unreserved-ticket/booking-history",
          {
            withCredentials: true,
          }
        );

        const fetchedTickets = res.data?.data || [];
        setTickets(fetchedTickets);

        // Expand ACTIVE tickets by default
        const activePNRs = fetchedTickets
          .filter((t) => t.pnrstatus === "ACTIVE")
          .map((t) => t.pnr);
        setExpandedPNRs(new Set(activePNRs));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch ticket history");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const toggleExpand = (pnr) => {
    setExpandedPNRs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pnr)) newSet.delete(pnr);
      else newSet.add(pnr);
      return newSet;
    });
  };

  const formatTime = (departure) => {
    const h = String(departure.hours).padStart(2, "0");
    const m = String(departure.minutes).padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();

  // useSprings for animating ticket details
  const springs = useSprings(
    tickets.length,
    tickets.map((ticket) => ({
      height: expandedPNRs.has(ticket.pnr) ? "auto" : 0,
      opacity: expandedPNRs.has(ticket.pnr) ? 1 : 0,
      overflow: "hidden",
      config: { tension: 250, friction: 25 },
    }))
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606122101045-78e0b57a6f57?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-orange-700/70" />

      <div className="relative w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-6 text-white">
          Ticket History
        </h2>

        {/* Empty State */}
        {tickets.length === 0 && !loading ? (
          <Fade
            triggerOnce
            cascade
            damping={0.3}
            duration={800}
            direction="up"
            className="flex justify-center"
          >
            <div className="mt-8 p-6 bg-white/80 rounded-lg text-gray-700 text-center shadow-lg animate-bounce">
              No tickets found
            </div>
          </Fade>
        ) : loading ? (
          <div className="flex justify-center items-center mt-8">
            <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {tickets.map((ticket, idx) => {
              //const isActive = ticket.pnrstatus === "ACTIVE";
              const isActive = ticket.pnrstatus === 0 ? true : false;
              const isExpanded = expandedPNRs.has(ticket.pnr);

              return (
                <Fade
                  key={ticket.pnr}
                  cascade
                  triggerOnce
                  direction="up"
                  duration={600}
                  delay={isActive ? 200 : 0}
                >
                  <div
                    className={`rounded-xl border-2 transition-transform duration-300 bg-yellow-100 cursor-pointer
                      ${
                        isActive
                          ? "border-green-500 hover:shadow-2xl hover:scale-[1.02] opacity-100 animate-pulse-glow"
                          : "border-red-500 hover:shadow-md hover:scale-[1.01] opacity-50 text-gray-800"
                      }`}
                  >
                    {/* Header */}
                    <div
                      className="p-4 flex justify-between items-center"
                      onClick={() => toggleExpand(ticket.pnr)}
                    >
                      <div>
                        <p
                          className={`font-semibold ${
                            !isActive ? "text-gray-700" : ""
                          }`}
                        >
                          {ticket.train_name}
                        </p>
                        <p
                          className={`text-sm ${
                            !isActive ? "text-gray-700" : "text-gray-500"
                          }`}
                        >
                          {ticket.source} ({ticket.source_code}) →{" "}
                          {ticket.destination} ({ticket.destination_code})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isActive ? "text-green-600" : "text-red-700"
                          }
                        >
                          {isActive ? "✅" : "❌"}
                        </span>
                        <span className="text-sm font-semibold">
                          {isActive ? "ACTIVE" : "EXPIRED"}
                        </span>
                      </div>
                    </div>

                    {/* Animated Details */}
                    <animated.div
                      style={springs[idx]}
                      className="px-4 pb-4 border-t border-gray-200 space-y-1 text-sm"
                    >
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Train Number: {ticket.train_number}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Journey Date: {formatDate(ticket.dateofjourney)} |
                        Departure: {formatTime(ticket.departure)}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Passengers: {ticket.adults} Adult(s), {ticket.children}{" "}
                        Child(ren)
                        {ticket.isphysicallyhandicapped ? " | PH" : ""}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Total Amount: ₹{ticket.totalamount}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Booked On:{" "}
                        {formatDate(ticket.datenadtimeofconfirmation)}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Payment Type:{" "}
                        {ticket.paytype === 1 ? "Online" : "Offline"}
                      </p>
                      <p
                        className={`${
                          !isActive ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        Mobile Number: {ticket.mobile_number}
                      </p>
                    </animated.div>
                  </div>
                </Fade>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              const token = Cookies.get("token");
              if (!token) {
                alert("Session expired, please re-login!");
                navigate("/"); // redirect to login
                return;
              } else {
                window.history.back();
              }
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg w-1/2"
          >
            Back
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-3 text-center text-white text-xs w-full">
        © {new Date().getFullYear()} ServePe App Solutions. All rights reserved.
      </footer>
    </div>
  );
};

export default TicketHistory;
