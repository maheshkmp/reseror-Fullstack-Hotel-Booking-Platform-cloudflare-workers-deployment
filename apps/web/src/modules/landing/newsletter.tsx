"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <div className="relative w-full">
      {/* Top half: background image */}
    

    
      <div className="w-full h-42 bg-white" />
        {/* Bottom half: white area */}
  <div
        className="w-full h-72 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1400&auto=format&fit=crop')",
        }}
      />
      {/* Card straddling both halves — centered vertically on the boundary */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex justify-center px-2">
        <div
          className="w-full max-w-2xl rounded-3xl px-8 py-8 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.50)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
            Subscribe us to know new updates
          </h2>
          <p className="text-gray-600 text-base max-w-md mx-auto mb-8">
            welcome to our hotel booking platform, where your travel experience becomes
            easier and more enjoyable.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md"
            style={{ background: "rgba(255,255,255,0.85)" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
              required
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="m-1 px-8 py-3 rounded-xl text-white font-bold text-base transition-all duration-200 hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{ background: "#1E2D5A" }}
            >
              {isSubscribed ? "✓ Subscribed!" : "Subscribe"}
            </button>
          </form>

          {isSubscribed && (
            <p className="text-green-700 text-sm mt-4 font-medium">
              ✨ Thank you! Check your email for confirmation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}