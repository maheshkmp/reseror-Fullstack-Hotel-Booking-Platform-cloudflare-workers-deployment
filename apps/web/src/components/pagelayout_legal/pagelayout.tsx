"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // ← replaces router.pathname

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation */}
      <header>
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-600 flex justify-center flex-wrap gap-x-3 gap-y-2">
          <Link
            href="#"
            className={`hover:font-semibold ${
              pathname === "#" ? "text-blue-900 font-bold" : ""
            }`}
          >
            Help center
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/legal/privacy"
            className={`hover:font-semibold ${
              pathname === "/legal/privacy" ? "text-blue-700 font-bold" : ""
            }`}
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/legal/terms"
            className={`hover:font-semibold ${
              pathname === "/legal/terms" ? "text-blue-700 font-bold" : ""
            }`}
          >
            Terms of Use
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/legal/faqs"
            className={`hover:font-semibold ${
              pathname === "/legal/faqs" ? "text-blue-700 font-bold" : ""
            }`}
          >
            FAQs
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/legal/dsa"
            className={`hover:font-semibold ${
              pathname === "/legal/dsa" ? "text-blue-700 font-bold" : ""
            }`}
          >
            Digital Services Act (EU)
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 mt-10 rounded-xl shadow-lg bg-white/60 backdrop-blur-sm border border-white/30">
        {title && (
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
