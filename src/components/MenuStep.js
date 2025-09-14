import React from "react";

const MenuStep = ({ onSelect, onExit }) => {
  const options = [
    { label: "Book Unreserved Ticket", value: "book" },
    { label: "Ticket History", value: "history" },
    { label: "Recharge Wallet", value: "wallet" },
    { label: "Exit", value: "exit" },
  ];

  const handleClick = (value) =>
    value === "exit" ? onExit() : onSelect(value);

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-green-300 mb-4">
        Welcome to Anti-Queue
      </h2>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className="w-full py-4 rounded-xl text-white font-semibold shadow-lg transition bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default MenuStep;
