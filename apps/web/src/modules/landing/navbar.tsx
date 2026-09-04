"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-8 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`font-black text-2xl tracking-tight transition-colors duration-300 ${
            scrolled ? "text-[#1E3A5F]" : "text-white drop-shadow"
          }`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Reseror
        </Link>

        {/* Center Nav Links — hidden on small screens */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Hotels", href: "/hotels" },
            { label: "Destinations", href: "/search" },
            { label: "Deals", href: "/ads" },
            { label: "Contact", href: "/contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-blue-500 ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className={`text-sm font-medium transition-colors duration-200 hidden sm:inline-flex ${
              scrolled
                ? "text-gray-700 hover:text-[#1E3A5F] hover:bg-gray-100"
                : "text-white hover:text-white hover:bg-white/20"
            }`}
          >
            <Link href="/setup-organization?mode=hotelOwner">List your Property</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-none border-none transition-all active:scale-95"
          >
            <Link href="/account">My Account</Link>
          </Button>
        </div>
      </header>
    </>
  );
}
