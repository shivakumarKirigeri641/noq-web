import React, { useState } from "react";

const PassengerDetails = ({
  source,
  destination,
  trains,
  goBack,
  onConfirm,
}) => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPH, setIsPH] = useState(false);

  const handlePHChange = (e) => {
    const checked = e.target.checked;
    setIsPH(checked);
    if (checked) {
      setAdults(1);
      setChildren(0);
    }
  };

  const calculateFare = () => {
    if (!selectedTrain) return 0;
    let baseFare = selectedTrain.baseFare;
    let total = adults * baseFare + children * (baseFare * 0.5);

    if (isPH) {
      total = baseFare * 0.6; // 40% concession
    }
    return total;
  };

  const handleConfirm = () => {
    if (!selectedTrain) {
      alert("Please select a train.");
      return;
    } else {
      onConfirm();
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6 text-white">
      <h2 className="text-xl font-bold text-center text-blue-300 mb-4">
        Passenger Details
      </h2>
      <p className="text-sm text-gray-300 mb-4">
        From <span className="font-semibold">{source}</span> → To{" "}
        <span className="font-semibold">{destination}</span>
      </p>

      {/* Train list */}
      <div className="mb-4 space-y-2">
        {trains.map((t) => (
          <label
            key={t.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name="train"
              checked={selectedTrain?.id === t.id}
              onChange={() => setSelectedTrain(t)}
            />
            <span>
              {t.name} – ₹{t.baseFare}
            </span>
          </label>
        ))}
      </div>

      {/* Adults dropdown */}
      <div className="mb-3">
        <label className="block text-sm mb-1">Adults</label>
        <select
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          disabled={isPH}
          className="w-full border border-white/30 rounded-lg px-3 py-2 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="text-black">
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Children dropdown */}
      <div className="mb-3">
        <label className="block text-sm mb-1">Children</label>
        <select
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          disabled={isPH}
          className="w-full border border-white/30 rounded-lg px-3 py-2 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="text-black">
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* PH checkbox */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPH}
          onChange={handlePHChange}
          id="ph"
        />
        <label htmlFor="ph">Physically Handicapped?</label>
      </div>

      {isPH && (
        <p className="text-yellow-400 text-sm mb-4">
          ⚠ Carry ID proof. Only 1 ticket allowed with 40% concession.
        </p>
      )}

      {/* Fare */}
      <div className="mb-4">
        <span className="font-semibold">Total Fare: ₹{calculateFare()}</span>
      </div>

      {/* Buttons */}
      <div className="flex-col">
        <button
          onClick={goBack}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-sm"
        >
          ⬅ Back
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-sm font-semibold"
        >
          Confirm & Book
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;
