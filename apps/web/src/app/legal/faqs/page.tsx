"use client";
import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Link from "next/link";
import { useState } from "react";
import { Search, ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    category: "General",
    question: "What is your return policy?",
    answer:
      "You can return most items within 30 days of delivery. Please ensure the items are in original condition with all original packaging intact.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "Go to the login page and click on 'Forgot password'. Follow the instructions sent to your email to securely reset your credentials.",
  },
  {
    category: "Billing",
    question: "When will I be charged?",
    answer:
      "You will be charged immediately upon confirming your order unless you are using a deferred payment method such as Pay Later.",
  },
  {
    category: "Shipping & Returns",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–7 business days. Expedited options are available at checkout for faster delivery.",
  },
  {
    category: "Technical Support",
    question: "Why am I having trouble logging in?",
    answer:
      "Ensure your username and password are correct. Try resetting your password or clearing your browser cache and cookies.",
  },
  {
    category: "General",
    question: "How do I make a hotel reservation?",
    answer:
      "Search for your destination, select your dates and guest count, choose a property that suits your needs, and follow the booking steps. Confirmation is sent instantly to your email.",
  },
  {
    category: "Billing",
    question: "Are there any hidden fees?",
    answer:
      "No. All fees including taxes and service charges are displayed transparently at checkout before you confirm your booking.",
  },
];

const categories = [
  { label: "All", count: faqData.length },
  { label: "General", count: faqData.filter((f) => f.category === "General").length },
  { label: "Account", count: faqData.filter((f) => f.category === "Account").length },
  { label: "Billing", count: faqData.filter((f) => f.category === "Billing").length },
  { label: "Shipping & Returns", count: faqData.filter((f) => f.category === "Shipping & Returns").length },
  { label: "Technical Support", count: faqData.filter((f) => f.category === "Technical Support").length },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Hero */}
      <div
        className="relative overflow-hidden py-10 px-4"
        style={{
          background: "linear-gradient(140deg, #07143d 0%, #0e2460 60%, #07143d 100%)",
        }}
      >
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Amber glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(251,191,36,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
         
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
           Frequently Asked Questions
          </h1>
          <p className="text-white/50 text-[14px] mb-8 max-w-md mx-auto">
            Browse our most common questions or search for a specific topic below.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-4 rounded-2xl text-white placeholder-white/30 text-sm focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-14">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar categories */}
          <aside className="lg:w-56 flex-shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-1">
              Categories
            </p>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
                    style={{
                      background: isActive ? "#07143d" : "transparent",
                      color: isActive ? "#fff" : "#6b7280",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(7,20,61,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span>{cat.label}</span>
                    <span
                      className="text-xs rounded-full px-2 py-0.5 font-semibold"
                      style={{
                        background: isActive ? "rgba(251,191,36,0.2)" : "rgba(0,0,0,0.06)",
                        color: isActive ? "#f59e0b" : "#9ca3af",
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* FAQ accordion */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <p className="text-sm text-gray-400 mb-5">
              Showing <span className="font-semibold text-gray-700">{filteredFaqs.length}</span> question{filteredFaqs.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && (
                <> in <span className="font-semibold text-[#07143d]">{activeCategory}</span></>
              )}
            </p>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-16">
                <HelpCircle size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 font-medium">No results found</p>
                <p className="text-gray-300 text-sm mt-1">Try a different search term or category</p>
              </div>
            )}

            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => {
                const isOpen = expandedIndex === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "#fff",
                      border: isOpen ? "1px solid rgba(7,20,61,0.15)" : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: isOpen ? "0 4px 24px rgba(7,20,61,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors"
                          style={{
                            background: isOpen ? "#07143d" : "rgba(7,20,61,0.06)",
                            color: isOpen ? "#f59e0b" : "#9ca3af",
                          }}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <span
                        className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          background: "rgba(251,191,36,0.1)",
                          color: "#d97706",
                        }}
                      >
                        {faq.category}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-6 pb-6 text-gray-500 text-sm leading-relaxed"
                            style={{ paddingLeft: "4.5rem" }}
                          >
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div
              className="mt-10 rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "linear-gradient(130deg, #07143d, #0e2460)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(251,191,36,0.15)" }}
                >
                  <MessageCircle size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Still have questions?</p>
                  <p className="text-white/45 text-xs mt-0.5">Our support team is ready to help you out.</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold text-[#07143d] transition-all hover:scale-105"
                style={{ background: "#f59e0b" }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}