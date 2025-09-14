import React, { useState, useEffect } from "react";
import { addavailableTrainsList } from "../store/slices/availableTrainsListSlice";
import { SERVER } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import PaymentPopup from "./PaymentPopup";
import clsx from "clsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Sample train data (replace with your actual data source)
export default function PassengerDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const srcselected = useSelector(
    (store) => store.selectedStationsAndDate.selectedsource
  );
  const destselected = useSelector(
    (store) => store.selectedStationsAndDate.selecteddestination
  );
  const sampleTrains = useSelector((store) => store.availableTrainsList);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [adults, setAdults] = useState(1);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [children, setChildren] = useState(0);
  const [isPH, setIsPH] = useState(false);
  const [fare, setFare] = useState(0);
  const [paymentCharges, setPaymentCharges] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Update adults count when PH is toggled
  useEffect(() => {
    if (isPH) {
      setAdults(1);
    }
  }, [isPH]);

  useEffect(() => {
    if (selectedTrain) {
      // 1. Calculate base fare
      const adultFare = selectedTrain?.base_fare * adults;
      const childFare = selectedTrain?.base_fare * children;
      let totalFare = adultFare + childFare;

      // 2. Apply PH discount
      if (isPH) {
        totalFare *= 0.75;
      }
      setFare(totalFare);

      // 3. Calculate additional charges based on total fare
      const calculatedPaymentCharges = totalFare * 0.013;
      const calculatedConvenienceFee = totalFare * 0.018;

      setPaymentCharges(calculatedPaymentCharges);
      setConvenienceFee(calculatedConvenienceFee);

      // 4. Calculate grand total
      const calculatedGrandTotal =
        totalFare + calculatedPaymentCharges + calculatedConvenienceFee;
      setGrandTotal(calculatedGrandTotal);
      console.log(selectedTrain);
    } else {
      setFare(0);
      setPaymentCharges(0);
      setConvenienceFee(0);
      setGrandTotal(0);
    }
  }, [selectedTrain, adults, children, isPH]);
  useEffect(() => {
    try {
      const fetchTrains = async () => {
        const result = await axios.post(
          SERVER + "/unreserved-ticket/trains-list",
          { src: srcselected?.code, dest: destselected?.code },
          { withCredentials: true }
        );
        console.log(result?.data?.data);
        dispatch(addavailableTrainsList(result?.data?.data));
      };
      fetchTrains();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  const isValid = selectedTrain !== null && adults >= 1;

  const handleConfirmBooking = () => {
    if (isValid) {
      console.log("Booking confirmed!", {
        selectedTrain,
        adults,
        children,
        isPH,
        fare,
      });
      setShowPaymentPopup(true);
    }
  };

  const passengerCountOptions = Array.from({ length: 7 }, (_, i) => i);
  const bookingDetails = {
    selectedTrain,
    adults,
    children,
    isPH,
    fare: fare.toFixed(2),
    paymentCharges: paymentCharges.toFixed(2),
    convenienceFee: convenienceFee.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Passenger Details
          </h2>

          {/* Train Select as Radio Buttons */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm md:text-base">
              Select Train
            </label>
            <div className="border border-gray-200 rounded-lg p-2 max-h-64 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {sampleTrains?.map((train) => (
                  <motion.label
                    key={train?.train_number}
                    className={clsx(
                      "flex items-center p-3 cursor-pointer rounded-lg mb-1 last:mb-0 transition-all duration-200 ease-in-out",
                      {
                        "bg-blue-50 border border-blue-300":
                          selectedTrain?.train_number === train?.train_number,
                        "hover:bg-gray-100":
                          selectedTrain?.train_number !== train?.train_number,
                      }
                    )}
                    htmlFor={`train-${train?.train_number}`}
                  >
                    <input
                      type="radio"
                      id={`train-${train?.train_number}`}
                      name="selectedTrain"
                      value={train?.train_number}
                      checked={
                        selectedTrain?.train_number === train?.train_number
                      }
                      onChange={() => setSelectedTrain(train)}
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 cursor-pointer"
                    />
                    <div className="w-full scroll-m-5">
                      {/*<span className="font-medium text-gray-800 text-sm md:text-base">
                      ({train.train_number}) {train.train_name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      Fare: Adults ₹{train.fare_per_adult} | Children ₹
                      {train.fare_per_child}
                    </span>*/}
                      <div className="border border-gray-400 rounded-xl hover:bg-blue-300 text-sm">
                        <div className="flex justify-around items-center text-gray-700 bg-blue-300 p-1 rounded-xl font-semibold">
                          <p>({train?.train_number})</p>
                          <p className="px-2">({train.train_name})</p>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-blue-600">
                          <p>INR. {train?.base_fare}</p>
                          <p className="px-2">{train?.km}km</p>
                        </div>
                      </div>
                    </div>
                  </motion.label>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Adults Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="adults"
              className="block mb-1 font-medium text-sm text-gray-700"
            >
              Adults (1–6)
            </label>
            <select
              id="adults"
              className={clsx(
                "w-full border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                { "bg-gray-100 cursor-not-allowed": isPH }
              )}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              disabled={isPH}
            >
              {isPH ? (
                <option value={1}>1</option>
              ) : (
                passengerCountOptions.slice(1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Children Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="children"
              className="block mb-1 font-medium text-sm text-gray-700"
            >
              Children (0–6)
            </label>
            <select
              id="children"
              className="w-full border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {passengerCountOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Physically Handicapped Toggle */}
          <div className="flex items-center mb-2">
            <input
              id="ph"
              type="checkbox"
              checked={isPH}
              onChange={(e) => setIsPH(e.target.checked)}
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
            />
            <label
              htmlFor="ph"
              className="ml-3 text-base font-medium text-gray-700 cursor-pointer"
            >
              Physically Handicapped
            </label>
          </div>

          {/* PH Warning Message */}
          <AnimatePresence>
            {isPH && (
              <motion.div
                transition={{ duration: 0.3 }}
                className="p-3 mb-4 rounded-xl bg-yellow-100 text-yellow-800 text-sm font-medium"
              >
                <p>
                  <span className="font-bold">Important:</span> This is a
                  separate ticket. Please carry ID proof.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {grandTotal > 0 && (
            <motion.div
              className="p-4 rounded-xl text-gray-800 font-medium mb-6 shadow-md  bg-green-200"
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Total Fare:</span>
                <span className="font-bold text-base">₹{fare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
                <span>Payment Charges (1.3%):</span>
                <span>+ ₹{paymentCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                <span>Convenience Fee (1.8%):</span>
                <span>+ ₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center text-lg font-bold border-t border-gray-500">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </motion.div>
          )}

          {/* Confirm Booking */}
          <motion.button
            disabled={!isValid}
            onClick={handleConfirmBooking}
            className={clsx(
              `w-full py-3 px-4 rounded-xl font-bold shadow-lg text-lg transition-all duration-200`,
              isValid
                ? `bg-blue-600 hover:bg-blue-700 text-white`
                : `bg-gray-400 cursor-not-allowed text-white`
            )}
          >
            Confirm Booking
          </motion.button>

          {/* Go Back at the bottom */}
          <motion.button
            onClick={() => {
              navigate(-1);
            }}
            className="mt-4 w-full py-3 px-4 rounded-xl text-white font-bold shadow-md bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-base"
          >
            Go Back
          </motion.button>
        </div>
      </div>
      {/* Payment Popup */}
      {showPaymentPopup && <PaymentPopup bookingDetails={bookingDetails} />}
    </>
  );
}
