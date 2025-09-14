import React, { useState, useRef, useEffect } from "react";

// Sample train data
const sampleTrains = [
  {
    number: "12345",
    name: "Express One",
    source: "Bangalore",
    destination: "Mumbai",
  },
  {
    number: "54321",
    name: "Express Two",
    source: "Delhi",
    destination: "Chennai",
  },
  {
    number: "67890",
    name: "Express Three",
    source: "Bangalore",
    destination: "Chennai",
  },
];

// TrainDetails Component
const TrainDetails = ({ goBack }) => {
  const sources = [...new Set(sampleTrains.map((t) => t.source))];
  const destinations = [...new Set(sampleTrains.map((t) => t.destination))];

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);
  const [filteredTrains, setFilteredTrains] = useState([]);

  const sourceRef = useRef();
  const destinationRef = useRef();

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  // Hide suggestion lists on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!sourceRef.current.contains(e.target)) setShowSourceList(false);
      if (!destinationRef.current.contains(e.target))
        setShowDestinationList(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSource = (value) => {
    setSource(value);
    setShowSourceList(false);
    destinationRef.current.querySelector("input").focus();
  };

  const handleSelectDestination = (value) => {
    setDestination(value);
    setShowDestinationList(false);
  };

  const handleSearch = () => {
    if (!sources.includes(source) || !destinations.includes(destination))
      return;
    const results = sampleTrains.filter(
      (t) => t.source === source && t.destination === destination
    );
    setFilteredTrains(results);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-yellow-300">
        Search Trains
      </h2>

      {/* Input Fields */}
      <div className="flex flex-col space-y-3">
        <div ref={sourceRef} className="relative">
          <input
            type="text"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setShowSourceList(true);
            }}
            onFocus={() => setShowSourceList(true)}
            placeholder="Source"
            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {showSourceList && (
            <ul className="absolute top-full left-0 right-0 bg-white/90 text-black rounded-lg max-h-32 overflow-y-auto z-10">
              {sources
                .filter((s) => s.toLowerCase().includes(source.toLowerCase()))
                .map((s) => (
                  <li
                    key={s}
                    className="px-3 py-1 hover:bg-yellow-200 cursor-pointer"
                    onClick={() => handleSelectSource(s)}
                  >
                    {s}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div ref={destinationRef} className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowDestinationList(true);
            }}
            onFocus={() => setShowDestinationList(true)}
            placeholder="Destination"
            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {showDestinationList && (
            <ul className="absolute top-full left-0 right-0 bg-white/90 text-black rounded-lg max-h-32 overflow-y-auto z-10">
              {destinations
                .filter((d) =>
                  d.toLowerCase().includes(destination.toLowerCase())
                )
                .map((d) => (
                  <li
                    key={d}
                    className="px-3 py-1 hover:bg-yellow-200 cursor-pointer"
                    onClick={() => handleSelectDestination(d)}
                  >
                    {d}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <input
          type="date"
          value={today}
          disabled
          className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
        />

        <button
          onClick={handleSearch}
          disabled={
            !sources.includes(source) || !destinations.includes(destination)
          }
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition
            ${
              sources.includes(source) && destinations.includes(destination)
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
        >
          Search
        </button>

        <button
          onClick={goBack}
          className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium mt-2"
        >
          Back
        </button>
      </div>

      {/* Train Results */}
      <div className="space-y-2">
        {filteredTrains.length === 0 && (
          <p className="text-gray-300 text-sm">No trains found.</p>
        )}
        {filteredTrains.map((train) => (
          <div key={train.number} className="bg-white/10 p-3 rounded-lg">
            <p className="font-semibold">
              {train.number} - {train.name}
            </p>
            <p className="text-sm text-gray-300">
              {train.source} → {train.destination}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainDetails;
