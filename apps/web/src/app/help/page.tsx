"use client";

import { useState } from "react";
import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Link from "next/link";
import {
  Search,
  BookOpen,
  CreditCard,
  CalendarX,
  Star,
  Home,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const topCategories = [
  {
    icon: BookOpen,
    label: "Booking & Reservations",
    desc: "Make, change or view bookings",
    href: "/help/bookings",
    count: 24,
  },
  {
    icon: CalendarX,
    label: "Cancellations & Refunds",
    desc: "Cancel a booking or request a refund",
    href: "/help/cancellations",
    count: 18,
  },
  {
    icon: CreditCard,
    label: "Payments & Billing",
    desc: "Payment methods, invoices, charges",
    href: "/help/payments",
    count: 15,
  },
  {
    icon: Home,
    label: "Property Information",
    desc: "Amenities, policies, check-in info",
    href: "/help/properties",
    count: 21,
  },
  {
    icon: Shield,
    label: "Account & Security",
    desc: "Login, passwords, account settings",
    href: "/help/account",
    count: 12,
  },
  {
    icon: Star,
    label: "Reviews & Ratings",
    desc: "Leave or manage your reviews",
    href: "/help/reviews",
    count: 9,
  },
];

const popularArticles = [
  { title: "How do I cancel my booking?", category: "Cancellations", href: "/help/cancel-booking" },
  { title: "When will I receive my refund?", category: "Refunds", href: "/help/refund-timing" },
  { title: "How do I change my booking dates?", category: "Bookings", href: "/help/change-dates" },
  { title: "What payment methods are accepted?", category: "Payments", href: "/help/payment-methods" },
  { title: "How do I contact a property directly?", category: "Properties", href: "/help/contact-property" },
  { title: "I can't log into my account", category: "Account", href: "/help/login-issues" },
  { title: "How do I get a booking confirmation?", category: "Bookings", href: "/help/confirmation" },
  { title: "What is Reseror's price match guarantee?", category: "Payments", href: "/help/price-match" },
];

const faqs = [
  {
    q: "How do I make a booking?",
    a: "Search your destination and dates, pick a property, select your room type, and complete checkout. A confirmation is sent to your email instantly.",
  },
  {
    q: "Can I book for someone else?",
    a: "Yes. During checkout, enter the guest's name in the booking details. Ensure the name matches the guest's ID for check-in.",
  },
  {
    q: "What is a free cancellation booking?",
    a: "Free cancellation means you can cancel before the stated deadline with a full refund. The exact deadline is shown on each listing before you confirm.",
  },
  {
    q: "How do I get an invoice for my booking?",
    a: "Log into your account, go to My Bookings, and select the booking. You can download a PDF invoice from the booking details page.",
  },
  {
    q: "Why was my payment declined?",
    a: "Declined payments are usually due to incorrect card details, insufficient funds, or your bank's security settings. Contact your bank or try a different payment method.",
  },
  {
    q: "How do I report an issue with a property?",
    a: "Contact us immediately via live chat or call +94 712 568 568. For post-stay issues, submit a complaint within 30 days through your booking details page.",
  },
];

const contactOptions = [
  // {
  //   icon: MessageCircle,
  //   label: "Live Chat",
  //   desc: "Chat with us now — average wait under 2 minutes",
  //   action: "Start chat",
  //   available: true,
  //   href: "#chat",
  // },
  {
    icon: Phone,
    label: "Call Us",
    desc: "+94 712 568 568 — available 24 hours, 7 days",
    action: "Call now",
    available: true,
    href: "tel:+94712568568",
  },
  {
    icon: Mail,
    label: "Email Support",
    desc: "info@reseror.com — reply within 2 business hours",
    action: "Send email",
    available: true,
    href: "mailto:info@reseror.com",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredArticles = search.trim()
    ? popularArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.category.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* ── Hero / Search ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 py-10"
        style={{ background: "linear-gradient(140deg, #07143d 0%, #0e2460 100%)" }}
      >
        {/* dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* amber glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(251,191,36,0.1) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">

          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How can we help you?
          </h1>
          <p className="text-white/45 text-sm mb-8">
            Search our help articles or browse topics below.
          </p>

          {/* Search box */}
          {/* <div className="relative max-w-xl mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-11 pr-5 py-4 rounded-2xl text-white text-sm placeholder-white/30 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            /> */}

            {/* Live search results */}
            {/* {search.trim().length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-20"
                style={{ background: "#fff", border: "1px solid #efefef" }}
              >
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <BookOpen size={14} className="text-gray-300 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{a.title}</span>
                      </div>
                      <span
                        className="text-xs font-semibold flex-shrink-0 ml-3 px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(7,20,61,0.06)", color: "#07143d" }}
                      >
                        {a.category}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-400">
                    No results for <span className="font-medium text-gray-700">"{search}"</span> — try different keywords.
                  </div>
                )}
              </div>
            )} */}
          {/* </div> */}

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-white/30 text-xs">Popular:</span>
            {["Cancel booking", "Refund status", "Change dates", "Payment issue"].map((t) => (
              <button
                key={t}
                onClick={() => setSearch(t)}
                className="text-xs px-3 py-1.5 rounded-full text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* ── Category cards ─────────────────────────────────────────────── */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-7">
            <h2
              className="text-xl font-bold"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Browse by topic
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topCategories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white transition-colors group"
                style={{ border: "1px solid #efefef" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(7,20,61,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#efefef";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: "rgba(7,20,61,0.06)" }}
                >
                  <cat.icon size={18} style={{ color: "#07143d" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#07143d]">
                      {cat.label}
                    </p>
                    <span
                      className="text-[10px] font-bold flex-shrink-0 px-2 py-0.5 rounded-full mt-0.5"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#d97706" }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Two-col: popular articles + FAQ ───────────────────────────── */}
        <div
          className="pb-5 grid grid-cols-1 lg:grid-cols-5 gap-10"
          style={{ borderTop: "1px solid #efefef", paddingTop: "3.5rem" }}
        >
          {/* Popular articles */}
          {/* <section className="lg:col-span-2">
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Popular articles
            </h2>
            <div className="space-y-1">
              {popularArticles.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between py-3 gap-3 group transition-colors"
                  style={{ borderBottom: "1px solid #f0ede8" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#f59e0b" }}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug">
                      {a.title}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </section> */}

          {/* FAQ accordion */}
          <section className="lg:col-span-5">
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden bg-white"
                    style={{ border: isOpen ? "1px solid rgba(7,20,61,0.15)" : "1px solid #efefef" }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                    >
                      <span className="text-sm font-semibold text-gray-800 leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className="flex-shrink-0 text-gray-400 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── Still need help ────────────────────────────────────────────── */}
        <section
          className="pb-16"
          style={{ borderTop: "1px solid #efefef", paddingTop: "3.5rem" }}
        >
          <div className="text-center mb-8">
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Still need help?
            </h2>
            <p className="text-gray-400 text-sm">
              Our support team is available 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {contactOptions.map((opt) => (
              <Link
                key={opt.label}
                href={opt.href}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white transition-colors group"
                style={{ border: "1px solid #efefef" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(7,20,61,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#efefef";
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(7,20,61,0.06)" }}
                >
                  <opt.icon size={20} style={{ color: "#07143d" }} />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{opt.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{opt.desc}</p>
                <span
                  className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-opacity group-hover:opacity-90"
                  style={{ background: "#07143d" }}
                >
                  {opt.action}
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ── Bottom status bar ─────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(130deg, #07143d, #0e2460)" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#4ade80" }}
            />
            <p className="text-white/70 text-sm">
              All systems operational · Support is{" "}
              <span className="text-white font-semibold">online now</span>
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link href="/legal/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/legal/cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
