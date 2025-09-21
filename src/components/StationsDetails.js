import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { SERVER } from "../utils/constants";
import { Wallet, LogOut } from "lucide-react"; // icons
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function StationDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let masterstations = useSelector((store) => store.stationsList);
  const [stations, setStations] = useState(
    !masterstations ? [] : masterstations
  );
  const [source, setSource] = useState("");
  const [sourceDetails, setSourceDetails] = useState({});
  const [destination, setDestination] = useState("");
  const [destinationDetails, setdestinationDetails] = useState({});
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestList, setShowDestList] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // ✅ define refs here
  const sourceRef = useRef(null);
  const destRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const handleWallet = () => {
    //navigate("/wallet-recharge");
  };

  const handleExit = () => {
    //navigate("/"); // or close app if mobile
  };
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get(SERVER + "/unreserved-ticket/stations", {
          withCredentials: true,
        });
        setStations(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    fetchStations();

    const handleClickOutside = (e) => {
      if (
        sourceRef.current &&
        !sourceRef.current.contains(e.target) &&
        destRef.current &&
        !destRef.current.contains(e.target)
      ) {
        setShowSourceList(false);
        setShowDestList(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStations = (query) =>
    stations?.filter(
      (s) =>
        s.station_name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
    );

  const handleSelectSource = (station) => {
    setSource(`${station.station_name} (${station.code})`);
    setSourceDetails(station);
    setShowSourceList(false);
    setHighlightIndex(-1);
    destRef.current.querySelector("input").focus();
  };

  const handleSelectDest = (station) => {
    setDestination(`${station.station_name} (${station.code})`);
    setdestinationDetails(station);
    setShowDestList(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e, type) => {
    const list = filteredStations(type === "source" ? source : destination);
    if (!list.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < list.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : list.length - 1));
    } else if ((e.key === "Enter" || e.key === "Tab") && highlightIndex >= 0) {
      e.preventDefault();
      const station = list[highlightIndex];
      type === "source"
        ? handleSelectSource(station)
        : handleSelectDest(station);
    }
  };

  const isValid =
    source &&
    destination &&
    source !== destination &&
    stations?.some((s) => source.includes(s.code)) &&
    stations?.some((s) => destination.includes(s.code));

  const handleSearch = async () => {
    try {
      const token = Cookies.get("token");
      console.log("token:", token);
      if (!token) {
        alert("Session expired, please re-login!");
        navigate("/"); // redirect to login
        return;
      } else {
        const res = await axios.post(
          SERVER + "/unreserved-ticket/trains-list",
          {
            src: sourceDetails?.code,
            dest: destinationDetails?.code,
          },
          { withCredentials: true }
        );
        if (res?.data?.data.length === 0) {
          alert("No trains found 🚆");
        } else {
          const trains = res?.data?.data;
          navigate("/passenger-details", { state: { trains } });
        }
      }
    } catch (err) {
      toast.error("Error fetching trains", {
        position: "top-center",
      });
      console.error(err);
    }
  };
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
        {/* Top-right icons */}
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            onClick={handleWallet}
            className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
            title="Wallet"
          >
            <Wallet className="w-5 h-5 text-orange-600" />
          </button>
          <button
            onClick={handleExit}
            className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
        {/* Card */}
        <div className="relative w-[360px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
            Station Details
          </h1>

          {/* Source Field */}
          <div className="mb-4 relative" ref={sourceRef}>
            <input
              type="text"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setShowSourceList(true);
                setHighlightIndex(0); // highlight first item on typing
              }}
              onFocus={() => {
                setSource(""); // clear field on focus
                setShowSourceList(true);
                setHighlightIndex(0); // highlight first suggestion
              }}
              onKeyDown={(e) => handleKeyDown(e, "source")}
              placeholder="Enter Source Station"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showSourceList && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {filteredStations(source).map((station, idx) => (
                  <li
                    key={station.code}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      idx === highlightIndex
                        ? "bg-blue-200"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => handleSelectSource(station)}
                  >
                    <div className="font-medium text-gray-800">
                      {station.station_name} ({station.code})
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.zone} · {station.address}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Field */}
          <div className="mb-4 relative" ref={destRef}>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestList(true);
                setHighlightIndex(0); // highlight first item on typing
              }}
              onFocus={() => {
                setDestination(""); // clear field on focus
                setShowDestList(true);
                setHighlightIndex(0); // highlight first suggestion
              }}
              onKeyDown={(e) => handleKeyDown(e, "dest")}
              placeholder="Enter Destination Station"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showDestList && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {filteredStations(destination).map((station, idx) => (
                  <li
                    key={station.code}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      idx === highlightIndex
                        ? "bg-blue-200"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => handleSelectDest(station)}
                  >
                    <div className="font-medium text-gray-800">
                      {station.station_name} ({station.code})
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.zone} · {station.address}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date Field */}
          <div className="mb-4">
            <input
              type="date"
              value={today}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Search Button */}
          <button
            disabled={!isValid}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => {
              handleSearch();
            }}
          >
            Search Trains
          </button>
          {/* Back Button */}
          <div className="w-full flex justify-center mt-6">
            <button
              onClick={() => {
                if (!token) {
                  alert("Session expired, please re-login!");
                  navigate("/"); // redirect to login
                  return;
                } else {
                  window.history.back();
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-gray-700 text-white rounded-lg w-full"
            >
              Back
            </button>
          </div>
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
