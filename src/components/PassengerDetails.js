import { useState, useRef, useEffect } from "react";

export default function PassengerDetails() {
  const trains = [
    { id: 1, number: "101", name: "Express", fare: 120, arrival: "08:30 AM" },
    { id: 2, number: "202", name: "Superfast", fare: 180, arrival: "10:15 AM" },
    { id: 3, number: "303", name: "Passenger", fare: 60, arrival: "01:45 PM" },
  ];

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [mobile, setMobile] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPH, setIsPH] = useState(false);
  const [bookingFor, setBookingFor] = useState("self");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const selectedFare = selectedTrain?.fare ?? 0;

  // Fare calculation
  const subtotal = selectedFare * adults + selectedFare * 0.5 * children;
  const phDiscount = isPH ? Math.round(subtotal * 0.5) : 0;
  const totalFare = Math.max(0, Math.round(subtotal - phDiscount));

  const validate = () => {
    const next = {};
    if (!selectedTrain) next.train = "Please select a train.";
    if (!/^\d{10}$/.test(mobile))
      next.mobile = "Enter a valid 10-digit mobile number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(
      `Booking confirmed!
Train: ${selectedTrain.number} - ${selectedTrain.name}
Adults: ${adults}
Children: ${children}
Mobile: ${mobile}
Booking for: ${bookingFor}
PH: ${isPH ? "Yes" : "No"}
Total Fare: ₹${totalFare}`
    );
  };

  // Validation popup if clicking outside with invalid inputs
  useEffect(() => {
    const onDown = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        if (!selectedTrain || !/^\d{10}$/.test(mobile)) {
          setErrors((prev) => ({
            ...prev,
            _global: "Please complete the required fields.",
          }));
        }
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [selectedTrain, mobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl bg-white border border-slate-100 shadow-2xl rounded-3xl p-8"
      >
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Passenger Details
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a train, enter passenger details, and review fare before
            booking.
          </p>
        </header>

        {/* Available Trains */}
        <section className="mb-8 relative">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Available Trains
          </h2>
          <div className="grid gap-3">
            {trains.map((t) => (
              <label
                key={t.id}
                className={`group flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition
                ${
                  selectedTrain?.id === t.id
                    ? "border-indigo-500 bg-indigo-50/70"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-800">
                    {t.number} - {t.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Fare: ₹{t.fare} | Arrival: {t.arrival}
                  </div>
                </div>
                <input
                  type="radio"
                  name="train"
                  value={t.id}
                  checked={selectedTrain?.id === t.id}
                  onChange={() => setSelectedTrain(t)}
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            ))}
          </div>
          {errors.train && (
            <div className="absolute -bottom-6 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded">
              {errors.train}
            </div>
          )}
        </section>

        {/* Mobile Number */}
        <section className="mb-8 relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className={`w-full rounded-xl border px-4 py-3 text-slate-800 shadow-sm focus:outline-none
              ${
                /^\d{10}$/.test(mobile)
                  ? "border-green-500 bg-green-50"
                  : "border-slate-300"
              }`}
          />
          {errors.mobile && (
            <div className="absolute -bottom-6 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded">
              {errors.mobile}
            </div>
          )}
        </section>

        {/* Adult and Child Counts */}
        <section className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Adults
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Children
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus:outline-none"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* PH Checkbox */}
        <section className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPH}
              onChange={(e) => setIsPH(e.target.checked)}
              className="h-5 w-5 accent-indigo-600"
            />
            <span className="text-slate-700 font-medium">
              Physically Handicapped
            </span>
          </label>
          {isPH && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ Carry valid proof to avail PH discount.
            </p>
          )}
        </section>

        {/* Booking For */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Booking For
          </h2>
          <div className="flex gap-4">
            <label
              className={`flex-1 rounded-xl border px-4 py-3 text-center cursor-pointer
              ${
                bookingFor === "self"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="bookingFor"
                value="self"
                checked={bookingFor === "self"}
                onChange={() => setBookingFor("self")}
                className="hidden"
              />
              Self
            </label>
            <label
              className={`flex-1 rounded-xl border px-4 py-3 text-center cursor-pointer
              ${
                bookingFor === "others"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="bookingFor"
                value="others"
                checked={bookingFor === "others"}
                onChange={() => setBookingFor("others")}
                className="hidden"
              />
              Others
            </label>
          </div>
        </section>

        {/* Fare Summary */}
        <section className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Fare Summary
          </h2>
          <ul className="text-slate-600 text-sm space-y-1">
            <li>
              Adults: {adults} × ₹{selectedFare} = ₹{selectedFare * adults}
            </li>
            <li>
              Children: {children} × ₹{selectedFare * 0.5} = ₹
              {selectedFare * 0.5 * children}
            </li>
            {isPH && <li>PH Discount: -₹{phDiscount}</li>}
          </ul>
          <div className="mt-3 text-lg font-bold text-slate-800">
            Total: ₹{totalFare}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg"
        >
          Confirm Booking
        </button>

        {/* Global error */}
        {errors._global && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-2 rounded shadow">
            {errors._global}
          </div>
        )}
      </form>
    </div>
  );
}
