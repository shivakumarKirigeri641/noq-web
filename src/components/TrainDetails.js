import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function TrainDetails() {
  const today = new Date();
  const navigate = useNavigate();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(todayStr);
  const [error, setError] = useState("");

  const [sourceActive, setSourceActive] = useState(false);
  const [destinationActive, setDestinationActive] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const formRef = useRef(null);
  const destinationInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const stations = ["Bangalore", "Chennai", "Mumbai", "Delhi", "Hyderabad"];

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
    const inputValue = type === "source" ? source : destination;
    const suggestions = stations.filter(
      (st) =>
        st.toLowerCase().includes(inputValue.toLowerCase()) &&
        (type === "source" ? st !== destination : st !== source)
    );
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        const selected = suggestions[highlightIndex];
        if (type === "source") {
          setSource(selected);
          setSourceActive(false);
          setHighlightIndex(-1);
          destinationInputRef.current.focus();
        } else {
          setDestination(selected);
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 
             bg-gradient-to-r from-indigo-100 to-blue-100 
             text-indigo-700 font-medium px-4 py-2 rounded-full 
             shadow-sm hover:shadow-md hover:from-indigo-200 hover:to-blue-200 
             transition-all duration-200 ease-in-out"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          🚆 Train details
        </h2>

        {/* Source */}
        <div className="mb-6 relative">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Source Station
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
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
                .filter(
                  (st) =>
                    st.toLowerCase().includes(source.toLowerCase()) &&
                    st !== destination
                )
                .map((st, i) => (
                  <li
                    key={st}
                    onClick={() => {
                      setSource(st);
                      setSourceActive(false);
                      destinationInputRef.current.focus();
                    }}
                    className={`px-3 py-2 cursor-pointer transition ${
                      highlightIndex === i
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {st}
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
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
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
                    st.toLowerCase().includes(destination.toLowerCase()) &&
                    st !== source
                )
                .map((st, i) => (
                  <li
                    key={st}
                    onClick={() => {
                      setDestination(st);
                      setDestinationActive(false);
                      dateInputRef.current.focus();
                    }}
                    className={`px-3 py-2 cursor-pointer transition ${
                      highlightIndex === i
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {st}
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
            ref={dateInputRef}
            value={date}
            min={todayStr}
            max={tomorrowStr}
            onChange={(e) => setDate(e.target.value)}
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
        <button
          onClick={handleSearch}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition transform hover:-translate-y-0.5"
        >
          Search Trains
        </button>
      </div>
    </div>
  );
}
