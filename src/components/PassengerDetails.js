import axios from "axios";
import { addavailableTrainsList } from "../store/slices/availableTrainsListSlice";
import { source } from "framer-motion/client";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SERVER, getArrivalDepartureTime } from "../utils/constants";

export default function PassengerDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const srcSelected = useSelector(
    (store) => store?.selectedStationsAndDate?.selectedsource
  );
  const destSelected = useSelector(
    (store) => store?.selectedStationsAndDate?.selecteddestination
  );
  const journeyDate = useSelector(
    (store) => store.selectedStationsAndDate.journeyDate
  );
  const parsedJourneyDate = journeyDate ? new Date(journeyDate) : null;
  const [selectedTrain, setSelectedTrain] = useState(null);

  const [bookingFor, setBookingFor] = useState("self");
  const [travellerMobile, setTravellerMobile] = useState("");
  const [bookerMobile, setBookerMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPH, setIsPH] = useState(false);

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const selectedFare = selectedTrain?.fare ?? 0;
  const subtotal = selectedFare * adults + selectedFare * 0.5 * children;
  const phDiscount = isPH ? Math.round(subtotal * 0.5) : 0;
  const totalFare = Math.max(0, Math.round(subtotal - phDiscount));

  // OTP Mock functions
  const sendOtp = () => {
    setOtpSent(true);
    setVerified(false);
    if ("others" === bookingFor && bookerMobile === travellerMobile) {
      setOtpSent(false);
      alert("Booker's mobile & Traveller's mobile cannot be same!");
    } else {
      alert("OTP sent! (For demo, use 1234)");
    }
  };

  const verifyOtp = () => {
    if (otp === "1234") {
      setVerified(true);
      alert("OTP Verified ✅");
    } else {
      alert("Invalid OTP ❌ (Hint: 1234)");
    }
  };

  const validate = () => {
    const next = {};
    if (!selectedTrain) next.train = "Please select a train.";

    if (bookingFor === "self") {
      if (!/^\d{10}$/.test(travellerMobile)) {
        next.travellerMobile = "Enter valid 10-digit mobile number.";
      }
    } else {
      if (!/^\d{10}$/.test(bookerMobile)) {
        next.bookerMobile = "Enter valid 10-digit booker's mobile number.";
      }
      if (!/^\d{10}$/.test(travellerMobile)) {
        next.travellerMobile =
          "Enter valid 10-digit traveller's mobile number.";
      }
    }

    if (!verified) {
      next.otp = "OTP must be verified before proceeding.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate("/confirmticket");
  };

  // Outside click global validation
  /*useEffect(() => {
    const onDown = (e) => {
      console.log("check");
      if (formRef.current && !formRef.current.contains(e.target)) {
        if (!selectedTrain || (!travellerMobile && !bookerMobile)) {
          setErrors((prev) => ({
            ...prev,
            _global: "Please complete the required fields.",
          }));
        }
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [selectedTrain, travellerMobile, bookerMobile]);*/
  const login = useSelector((store) => store.login);
  let trains_new = useSelector((store) => store.availableTrainsList);
  console.log(trains_new);
  useEffect(() => {
    try {
      if (!login) {
        navigate("/");
      } else {
        const fetchTrainList = async () => {
          const result = await axios.post(
            SERVER +
              "/noq/noqunreservedticket/" +
              srcSelected?.code +
              "/" +
              destSelected?.code +
              "/" +
              journeyDate,
            {},
            { withCredentials: true }
          );
          dispatch(addavailableTrainsList(result?.data?.result));
        };
        fetchTrainList();
      }
    } catch (err) {
      console.log(err.message);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl bg-white border border-slate-100 shadow-2xl rounded-3xl p-8"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 
                     bg-gradient-to-r from-indigo-100 to-blue-100 
                     text-indigo-700 font-medium px-4 py-1 rounded-full 
                     shadow-sm hover:shadow-md hover:from-indigo-200 hover:to-blue-200 
                     transition-all duration-200 ease-in-out"
        >
          <span className="text-lg">←</span>
          <span className="text-sm">Back</span>
        </button>

        {/* selected src dest */}
        <div className="text-sm mt-8 italic">
          <p>
            You are going from{" "}
            <span className="text-blue-600 font-semibold">
              {srcSelected?.name}
            </span>{" "}
            to{" "}
            <span className="text-blue-600 font-semibold">
              {destSelected?.name}
            </span>{" "}
            on{" "}
            <span className="text-blue-600 font-semibold">
              {parsedJourneyDate?.toISOString()}
            </span>
          </p>
        </div>
        {/* Header */}
        <header className="my-8 text-center">
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
          <div className="grid gap-3 text-sm">
            {trains_new?.map((t) => (
              <label
                key={t?.traindDetails?.trainNumber}
                className={`group flex items-center justify-between rounded-2xl border cursor-pointer transition
                ${
                  selectedTrain?.traindDetails?.trainNumber ===
                  t?.traindDetails?.trainNumber
                    ? "border-indigo-500 bg-indigo-50/70 p-1"
                    : "border-slate-200 hover:bg-slate-50 p-1"
                }`}
              >
                <div className="flex justify-between items-center ">
                  <div className="">
                    <div className="font-semibold text-slate-800 py-1p-2 rounded-2xl">
                      {t?.traindDetails?.trainNumber} -{" "}
                      {t?.traindDetails?.trainName}
                    </div>
                    <div className="text-xs font-semibold my-1 text-slate-500 p-2">
                      Fare: ₹{t?.priceDetails[0].totalFare} | Arrival:{" "}
                      {
                        getArrivalDepartureTime(
                          srcSelected?.code,
                          t?.traindDetails?.stationList
                        )?.arrivalTime
                      }{" "}
                      | departureTime:{" "}
                      {
                        getArrivalDepartureTime(
                          srcSelected?.code,
                          t?.traindDetails?.stationList
                        )?.departureTime
                      }
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="train"
                    value={t?.traindDetails?.trainNumber}
                    checked={
                      selectedTrain?.traindDetails?.trainNumber ===
                      t?.traindDetails?.trainNumber
                    }
                    onChange={() => setSelectedTrain(t)}
                    className="h-5 w-5 accent-indigo-600"
                  />
                </div>
              </label>
            ))}
            {errors.train && (
              <div className="absolute -bottom-6 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded">
                {errors.train}
              </div>
            )}
          </div>
        </section>

        {/* Booking For */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Booking For
          </h2>
          <div className="flex gap-4">
            {["self", "others"].map((type) => (
              <label
                key={type}
                className={`flex-1 rounded-xl border px-4 py-3 text-center cursor-pointer
                ${
                  bookingFor === type
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="bookingFor"
                  value={type}
                  checked={bookingFor === type}
                  onChange={() => {
                    setBookingFor(type);
                    setOtpSent(false);
                    setVerified(false);
                  }}
                  className="hidden"
                />
                {type === "self" ? "Self" : "Others"}
              </label>
            ))}
          </div>
        </section>

        {/* Mobile Inputs */}
        <section className="mb-8 space-y-4">
          {bookingFor === "others" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Booker’s Mobile Number
              </label>
              <input
                type="text"
                value={bookerMobile}
                onChange={(e) =>
                  setBookerMobile(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 10-digit booker's number"
                maxLength={10}
                className={`w-full rounded-xl border px-4 py-3 text-slate-800 shadow-sm focus:outline-none
                  ${
                    /^\d{10}$/.test(bookerMobile)
                      ? "border-green-500 bg-green-50"
                      : "border-slate-300"
                  }`}
              />
              {errors.bookerMobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bookerMobile}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Traveller’s Mobile Number
            </label>
            <input
              type="text"
              value={travellerMobile}
              onChange={(e) => {
                setTravellerMobile(e.target.value.replace(/\D/g, ""));
              }}
              placeholder="Enter 10-digit traveller's number"
              maxLength={10}
              className={`w-full rounded-xl border px-4 py-3 text-slate-800 shadow-sm focus:outline-none
                ${
                  /^\d{10}$/.test(travellerMobile)
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300"
                }`}
            />
            {errors.travellerMobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.travellerMobile}
              </p>
            )}
          </div>

          {/* OTP Section */}
          <div>
            <button
              type="button"
              onClick={sendOtp}
              disabled={
                bookingFor === "self"
                  ? travellerMobile.length !== 10
                  : bookerMobile.length !== 10
              }
              className={`w-full py-2 rounded-lg mb-2 text-white font-medium 
                ${
                  (bookingFor === "self" && travellerMobile.length === 10) ||
                  (bookingFor === "others" && bookerMobile.length === 10)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Get OTP
            </button>

            {otpSent && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter OTP"
                  maxLength={4}
                  className="flex-1 rounded-xl border px-4 py-2 shadow-sm"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Verify
                </button>
              </div>
            )}
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
            )}
          </div>
        </section>

        {/* Adults & Children */}
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
          className={
            totalFare === 0
              ? "w-full py-3 rounded-xl bg-gray-400 text-white font-semibold hover:bg-indigo-700 shadow-lg"
              : "w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg"
          }
          disabled={totalFare === 0 ? true : false}
        >
          Confirm & Pay
        </button>

        {errors._global && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-2 rounded shadow">
            {errors._global}
          </div>
        )}
      </form>
    </div>
  );
}
