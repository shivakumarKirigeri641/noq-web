// src/components/PaymentPopup.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addconfirmedTicketDetails } from "../store/slices/confirmedTicketDetailsSlice";

const PaymentPopup = ({ bookingDetails, pay_type = 1 }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    // Generate a random duration between 2000ms and 6000ms
    const randomDuration = Math.random() * 4000 + 2000;

    // Set a timer to automatically navigate after the random duration
    timerRef.current = setTimeout(() => {
      handleConfirm();
    }, randomDuration);

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    // Clear the timer to prevent double navigation
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Set visibility to false to trigger the exit animation
    setIsVisible(false);

    // Navigate to the confirmation page after the exit animation completes
    setTimeout(() => {
      navigate("/confirmticket", { state: { bookingDetails } });
    }, 500); // Wait for 500ms for the modal to fade out
  };
  useEffect(() => {
    console.log("test");
    try {
      const confirmTicketDetails = async () => {
        try {
          const result = await axios.post(
            "/unreserved-ticket/book-ticket",
            {
              train_number: bookingDetails.train_number,
              adults: bookingDetails.adults,
              child: bookingDetails.children,
              physically_handicapped: bookingDetails.isPH,
              total_fare: bookingDetails.fare,
              source_code: bookingDetails.selectedTrain.from_station,
              destination_code: bookingDetails.selectedTrain.from_station,
              pay_type: pay_type,
            },
            { withCredentials: true }
          );
          addconfirmedTicketDetails(result?.data?.data);
        } catch (err) {
          console.log(err.message);
        }
      };
      confirmTicketDetails();
    } catch (err) {
      console.log(err.message);
    }
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center transform scale-95"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-dashed rounded-full border-blue-500 animate-spin-slow"></div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Processing Your Payment...
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please wait while we confirm your booking.
            </p>

            <motion.button
              onClick={handleConfirm}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-lg transition-colors bg-green-600 hover:bg-green-700 shadow-md"
            >
              Confirm Now
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentPopup;
