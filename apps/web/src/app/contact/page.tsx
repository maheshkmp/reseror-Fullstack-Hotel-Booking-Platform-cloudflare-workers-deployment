"use client";

import { useState } from "react";
import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const inquiryTypes = [
  "General Inquiry",
  "Booking Support",
  "Brand Collaboration",
  "Press & Media",
  "Technical Issue",
  "Other",
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Our Office",
    value: "Colombo, Sri Lanka",
  },
  {
    icon: Phone,
    label: "Customer Care",
    value: "+94 712 568 568",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@reseror.com",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24 / 7 / 365",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4"
        style={{ background: "linear-gradient(140deg, #07143d 0%, #0e2460 100%)" }}
      >
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-5"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            Get in Touch
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We're Here for You
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Booking questions, partnerships, or just saying hello — our team is always ready.
          </p>
        </div>
      </section>

      {/* Contact info strip */}
      <div
        className="border-b"
        style={{ borderColor: "#f0f0f0" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 divide-x"
          style={{ color: "#f0f0f0" }}
        >
          {contactInfo.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-6 px-4 md:px-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(7,20,61,0.06)" }}
              >
                <item.icon size={16} style={{ color: "#07143d" }} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* Left: brief copy */}
          <div className="lg:col-span-2 flex flex-col justify-start pt-1">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Send us a message
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Fill in the form and we'll get back to you within 2 business hours. No bots — a real person will respond.
            </p>

            <div className="space-y-5">
              {[
                { label: "Booking Support", detail: "Changes, cancellations, modifications" },
                { label: "Partnerships", detail: "Brand collabs and property listings" },
                { label: "Media & Press", detail: "Press kits and interview requests" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#f59e0b", marginTop: "6px" }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none transition-colors"
                      style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#07143d")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#efefef")}
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none transition-colors"
                      style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#07143d")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#efefef")}
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Inquiry Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 focus:outline-none transition-colors appearance-none"
                    style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#07143d")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#efefef")}
                  >
                    <option value="" disabled>Select a topic...</option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none transition-colors resize-none"
                    style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#07143d")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#efefef")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-opacity disabled:opacity-60"
                  style={{ background: "#07143d" }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Your information is never shared with third parties.
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(7,20,61,0.07)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l4.5 4.5L19 8" stroke="#07143d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Received</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  We'll reply to <span className="text-gray-700 font-medium">{form.email}</span> within 2 business hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}