import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const makePaymentAndBooking = async () => {
      if (!bookingData) {
        toast.error("Booking data missing!");
        navigate(-1);
        return;
      }
      try {
        const result = await axios.post(
          process.env.REACT_APP_SERVER + "/unreserved-ticket/book-ticket",
          {
            train_number: bookingData?.traindata?.train_number,
            adults: bookingData?.passengerdata?.adults,
            child: bookingData?.passengerdata?.children,
            physically_handicapped: bookingData?.passengerdata?.isPH,
            total_fare: bookingData?.passengerdata?.total,
            source_code: bookingData?.traindata?.pass_from,
            destination_code: bookingData?.traindata?.pass_to,
            pay_type: 1,
          },
          { withCredentials: true }
        );
        toast.success("Payment successful & Booking confirmed!");
        const ticketdata = result?.data;
        navigate("/confirm-ticket", {
          state: { ticketdata },
        });
      } catch (err) {
        console.error(err);
        toast.error("Payment or booking failed!");
        navigate(-1);
      }
    };

    makePaymentAndBooking();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Processing Payment...</h2>
        <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></span>
        <p className="mt-4 text-gray-600">
          Please wait while we confirm your booking.
        </p>
      </div>
    </div>
  );
};

export default Payment;
