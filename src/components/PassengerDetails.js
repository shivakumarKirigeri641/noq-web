import React, { useState, useMemo } from "react";
import Cookies from "js-cookie";
import Layout from "./Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PassengerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Trains passed from StationDetails
  const trains = location.state?.trains || [];

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPH, setIsPH] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fare calculation
  // Fare breakdown calculation
  const fareBreakdown = useMemo(() => {
    if (!selectedTrain) return null;

    const baseFare = selectedTrain.base_fare || 0;

    let adultFare = adults * baseFare;
    let childrenFare = children * (baseFare * 0.5);

    let totalFare = adultFare + childrenFare;

    if (isPH) totalFare = totalFare * 0.6;

    const paymentCharges = totalFare * 0.018;
    const convenienceFee = totalFare * 0.013;
    const grossTotal = totalFare + paymentCharges + convenienceFee;

    return {
      adultFare,
      childrenFare,
      totalFare,
      paymentCharges,
      convenienceFee,
      grossTotal,
    };
  }, [adults, children, isPH, selectedTrain]);

  // Validation before booking
  const validateBooking = () => {
    if (!selectedTrain) {
      toast.error("Please select a train");
      return false;
    }

    if (isPH && adults > 1) {
      toast.error("Only 1 adult can be selected for Physically Handicapped");
      return false;
    }

    if (isPH && children > 0 && adults < 1) {
      toast.error(
        "At least 1 adult must accompany a physically handicapped child"
      );
      return false;
    }

    return true;
  };

  const handleConfirm = async () => {
    if (!validateBooking()) return;
    //setLoading(true);
    try {
      // Replace this with actual booking API
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = Cookies.get("token");
      if (!token) {
        alert("Session expired, please re-login!");
        navigate("/"); // redirect to login
        return;
      } else {
        //navigate("/wallet-recharge");
        const total = fareBreakdown?.grossTotal;
        navigate("/payment", {
          state: {
            bookingData: {
              traindata: selectedTrain,
              passengerdata: { total, adults, children, isPH },
            },
          },
        }); // redirect to homepage or booking summary
      }
    } catch (err) {
      toast.error("Booking failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative flex flex-col justify-center items-center h-screen w-screen">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold text-center mb-6">
            Passenger Details
          </h2>

          {/* Trains List */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Select Train</h3>
            {trains.length > 0 ? (
              trains.map((train, idx) => (
                <label
                  key={idx}
                  className="flex items-center mb-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="train"
                    value={train.code}
                    checked={selectedTrain?.train_number === train.train_number}
                    onChange={() => setSelectedTrain(train)}
                    className="mr-2"
                  />
                  <div className="w-full overflow-auto">
                    <p className="font-semibold">
                      {train.train_name} ({train.train_number})
                    </p>
                    <p className="text-xs text-gray-700">
                      {train.train_source} → {train.train_destination}
                    </p>
                    <div className="flex justify-between items-center py-1">
                      <p className="text-xs text-gray-800 font-semibold py-1">
                        Fare: ₹{train.base_fare}
                      </p>
                      <p className="text-xs text-gray-800 font-semibold py-1">
                        Departure: ₹{train.departure}
                      </p>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No trains available</p>
            )}
          </div>

          {/* Adults */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Adults</label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              disabled={isPH} // if PH, adults always = 1
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[...Array(6).keys()].map((n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Children */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Children</label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[...Array(7).keys()].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* PH */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPH}
                onChange={(e) => {
                  setIsPH(e.target.checked);
                  if (e.target.checked) setAdults(1); // force adults = 1
                }}
                className="mr-2"
              />
              Is Physically Handicapped
            </label>
            {isPH && (
              <p className="text-xs text-red-500 mt-1">
                ⚠ Please carry ID proof
              </p>
            )}
          </div>

          {/* Fare Breakdown */}
          {fareBreakdown && (
            <div className="mb-4 border rounded-lg p-3 bg-gray-50 text-sm">
              <div className="flex justify-between items-center">
                <p>Base Fare (Adults): </p>
                <p>₹{fareBreakdown.adultFare.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Base Fare (Children): </p>
                <p>₹{fareBreakdown.childrenFare.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Payment Charges (1.8%): </p>
                <p>₹{fareBreakdown.paymentCharges.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Convenience Fee (1.3%): </p>
                <p>₹{fareBreakdown.convenienceFee.toFixed(2)}</p>
              </div>
              <div className="font-semibold mt-2 bg-green-300 p-1">
                <div className="flex justify-between items-center">
                  <p>Gross Total: </p>
                  <p>₹{fareBreakdown.grossTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between">
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
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Confirm & Book"
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PassengerDetails;
