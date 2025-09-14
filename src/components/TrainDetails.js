import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SERVER } from "../utils/constants";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addStationsList } from "../store/slices/stationsListSlice";
import {
  addDestination,
  addJourneyDate,
  addSource,
} from "../store/slices/selectedStationsAndDateSlice";

export default function TrainDetails() {
  const today = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // separate input text and selected station objects
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  const [date, setDate] = useState(todayStr);
  const [error, setError] = useState("");

  const [sourceActive, setSourceActive] = useState(false);
  const [destinationActive, setDestinationActive] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const formRef = useRef(null);
  const destinationInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const stations = useSelector((store) => store.stationsList);
  const login = useSelector((store) => store.login);

  useEffect(() => {
    if (!login) {
      navigate("/");
    } else {
      const fetchstations = async () => {
        const result = await axios.get(SERVER + "/unreserved-ticket/stations", {
          withCredentials: true,
        });
        console.log(result?.data?.data);
        dispatch(addStationsList(result?.data?.data));
      };
      fetchstations();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (!source || !destination) {
          setError("Please select both source and destination");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [source, destination]);

  const handleSearch = () => {
    if (!source || !destination) {
      setError("Please select both source and destination");
      return;
    }
    navigate("/passengerdetails");
  };

  const handleKeyDown = (e, type) => {
    const inputValue = type === "source" ? sourceInput : destinationInput;

    const suggestions = stations?.filter(
      (st) =>
        (st.station_name.toLowerCase().includes(inputValue.toLowerCase()) ||
          st.code.toLowerCase().includes(inputValue.toLowerCase())) &&
        (type === "source"
          ? st.code !== destination?.code
          : st.code !== source?.code)
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions?.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        const selected = suggestions[highlightIndex];
        if (type === "source") {
          setSource(selected);
          setSourceInput(`${selected.station_name} (${selected.code})`);
          dispatch(addSource(selected));
          console.log(selected);
          setSourceActive(false);
          setHighlightIndex(-1);
          destinationInputRef.current.focus();
        } else {
          setDestination(selected);
          dispatch(addDestination(selected));
          console.log(selected);
          setDestinationInput(`${selected.station_name} (${selected.code})`);
          setDestinationActive(false);
          setHighlightIndex(-1);
          dateInputRef.current.focus();
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div
        ref={formRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-100"
      >
        <h2 className="text-2xl font-bold my-8 text-center text-gray-800">
          🚆 Journey details
        </h2>

        {/* Source */}
        <div className="mb-6 relative">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Source Station
          </label>
          <input
            type="text"
            value={sourceInput}
            onChange={(e) => {
              setSourceInput(e.target.value);
              setSource(null);
              setSourceActive(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => {
              setSourceActive(true);
              setHighlightIndex(-1);
            }}
            onKeyDown={(e) => handleKeyDown(e, "source")}
            placeholder="Enter source station"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-gray-800"
          />
          {sourceActive && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
              {stations
                ?.filter(
                  (st) =>
                    (st.station_name
                      .toLowerCase()
                      .includes(sourceInput.toLowerCase()) ||
                      st.code
                        .toLowerCase()
                        .includes(sourceInput.toLowerCase())) &&
                    st.code !== destination?.code
                )
                .map((st, i) => (
                  <li
                    key={st.code}
                    onClick={() => {
                      setSource(st);
                      dispatch(addSource(st));
                      setSourceInput(`${st.station_name} (${st.code})`);
                      setSourceActive(false);
                      destinationInputRef.current.focus();
                    }}
                    className={`px-3 py-2 cursor-pointer transition ${
                      highlightIndex === i
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {st.station_name} ({st.code})
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Destination */}
        <div className="mb-6 relative">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Destination Station
          </label>
          <input
            type="text"
            ref={destinationInputRef}
            value={destinationInput}
            onChange={(e) => {
              setDestinationInput(e.target.value);
              setDestination(null);
              setDestinationActive(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => {
              setDestinationActive(true);
              setHighlightIndex(-1);
            }}
            onKeyDown={(e) => handleKeyDown(e, "destination")}
            placeholder="Enter destination station"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-gray-800"
          />
          {destinationActive && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
              {stations
                .filter(
                  (st) =>
                    (st.station_name
                      .toLowerCase()
                      .includes(destinationInput.toLowerCase()) ||
                      st.code
                        .toLowerCase()
                        .includes(destinationInput.toLowerCase())) &&
                    st.code !== source?.code
                )
                .map((st, i) => (
                  <li
                    key={st.code}
                    onClick={() => {
                      setDestination(st);
                      dispatch(addDestination(st));
                      setDestinationInput(`${st.station_name} (${st.code})`);
                      setDestinationActive(false);
                      dateInputRef.current.focus();
                    }}
                    className={`px-3 py-2 cursor-pointer transition ${
                      highlightIndex === i
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {st.station_name} ({st.code})
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Travel Date
          </label>
          <input
            type="date"
            disabled
            ref={dateInputRef}
            value={date}
            min={todayStr}
            max={tomorrowStr}
            onChange={(e) => {
              setDate(e.target.value);
              dispatch(addJourneyDate(date));
            }}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-gray-800"
          />
        </div>

        {/* Error Popover */}
        {error && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-4 py-2 rounded-lg shadow-md">
            {error}
          </div>
        )}

        {/* Search Button */}
        <motion.button
          onClick={handleSearch}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition transform hover:-translate-y-0.5"
        >
          Search Trains
        </motion.button>
        {/* Go Back at the bottom */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            navigate(-1);
          }}
          className="mt-4 w-full py-3 px-4 rounded-xl text-white font-bold shadow-md bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-base"
        >
          Go Back
        </motion.button>
      </div>
    </div>
  );
}
