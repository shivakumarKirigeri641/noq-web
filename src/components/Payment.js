import React, { useEffect } from "react";

const Payment = ({ onSuccess, goBack }) => {
  useEffect(() => {
    const randomTime = Math.floor(Math.random() * 3000) + 2000; // 2–5 sec
    const timer = setTimeout(() => {
      onSuccess();
    }, randomTime);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6 text-center text-white">
      <h2 className="text-xl font-bold text-blue-300 mb-4">
        Processing Payment...
      </h2>
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
      <p className="mt-4 text-gray-300 text-sm">
        Please wait, this may take a few seconds.
      </p>
      <button
        onClick={goBack}
        className="mt-6 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-sm"
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default Payment;
