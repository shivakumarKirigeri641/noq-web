import React from "react";

export default function Layout({ children }) {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen w-screen">
      {/* Shared Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606122101045-78e0b57a6f57?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-orange-700/70" />

      {/* Screen Content */}
      <div className="relative z-10 flex flex-col justify-center items-center">
        {children}
      </div>

      {/* Shared Footer */}
      <footer className="absolute bottom-3 text-center text-white text-xs">
        © {new Date().getFullYear()} ServePe App Solutions. All rights reserved.
      </footer>
    </div>
  );
}
