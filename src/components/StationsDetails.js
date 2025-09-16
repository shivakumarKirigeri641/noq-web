import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER } from "../utils/constants";
import { addStationsList } from "../store/slices/stationsListSlice";
import { useDispatch, useSelector } from "react-redux";

const StationsDetails = ({ goBack, onSearch, onNext, onLogin }) => {
  const dispatch = useDispatch();
  const stations = useSelector((store) => store.stationsList);
  const [loading, setLoading] = useState(true);

  const [source, setSource] = useState(""); //source object, see how will you show, saveing is ok
  const [sourceDetails, setsourceDetails] = useState({}); //source object, see how will you show, saveing is ok
  const [destination, setDestination] = useState("");
  const [destinationDetails, setdestinationDetails] = useState({}); //source object, see how will you show, saveing is ok
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestList, setShowDestList] = useState(false);

  const sourceRef = useRef();
  const destRef = useRef();

  useEffect(() => {
    const fetchstations = async () => {
      try {
        const result = await axios.get(SERVER + "/unreserved-ticket/stations", {
          withCredentials: true,
        });
        console.log(result?.data?.data);
        dispatch(addStationsList(result?.data?.data));
      } catch (err) {
        console.log("ERror:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchstations();
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target)) {
        setShowSourceList(false);
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowDestList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async () => {
    if (!source || !destination) {
      alert("Please select valid Source and Destination");
      return;
    }
    //see if train present?
    let count = 0;
    try {
      const result = await axios.post(
        SERVER + "/unreserved-ticket/trains-list",
        { src: sourceDetails?.code, dest: destinationDetails?.code },
        { withCredentials: true }
      );
      console.log(result?.data?.data);
      if (0 < result?.data?.data.length) {
        //console.log("soruce details:", sourceDetails);
        //console.log("dest details:", destinationDetails);
        //console.log("count:", result?.data?.data.length);
        onSearch({
          details: {
            source: sourceDetails,
            destination: destinationDetails,
            count,
          },
        });
      } else {
        alert("No trains found");
      }
    } catch (err) {
      console.log(err.message);
      onLogin();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-gray-200">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-center text-purple-300 mb-6">
        Station Selection
      </h2>

      {/* Source */}
      <div className="relative mb-4" ref={sourceRef}>
        <input
          type="text"
          value={source}
          onFocus={() => setShowSourceList(true)}
          onChange={(e) => {
            setSource(e.target.value);
            setShowSourceList(true);
          }}
          placeholder="Enter Source Station"
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm"
        />
        {showSourceList && (
          <ul className="absolute top-full left-0 w-full bg-white text-black rounded-lg shadow-md max-h-40 overflow-y-auto z-10">
            {stations
              ?.filter(
                (s) =>
                  s.station_name.toLowerCase().includes(source.toLowerCase()) ||
                  s.code.toLowerCase().includes(source.toLowerCase())
              )
              .map((s) => (
                <li
                  key={s.code}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSource(`${s.station_name} (${s.code})`);
                    setsourceDetails(s);
                    setShowSourceList(false);
                    destRef.current.querySelector("input")?.focus();
                  }}
                >
                  {s.station_name} ({s.code})
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Destination */}
      <div className="relative mb-4" ref={destRef}>
        <input
          type="text"
          value={destination}
          onFocus={() => setShowDestList(true)}
          onChange={(e) => {
            setDestination(e.target.value);
            setShowDestList(true);
          }}
          placeholder="Enter Destination Station"
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm"
        />
        {showDestList && (
          <ul className="absolute top-full left-0 w-full bg-white text-black rounded-lg shadow-md max-h-40 overflow-y-auto z-10">
            {stations
              ?.filter(
                (s) =>
                  s.station_name
                    .toLowerCase()
                    .includes(destination.toLowerCase()) ||
                  s.code.toLowerCase().includes(destination.toLowerCase())
              )
              .map((s) => (
                <li
                  key={s.code}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setDestination(`${s.station_name} (${s.code})`);
                    setdestinationDetails(s);
                    setShowDestList(false);
                  }}
                >
                  {s.station_name} ({s.code})
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Date (today, disabled) */}
      <input
        type="date"
        value={new Date().toISOString().split("T")[0]}
        disabled
        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm mb-4 text-gray-400"
      />

      <div className="flex gap-2">
        <button
          onClick={goBack}
          className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={handleSearch}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default StationsDetails;
