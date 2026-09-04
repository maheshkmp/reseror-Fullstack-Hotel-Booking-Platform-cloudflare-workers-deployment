import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Reseror — Where Every Journey Begins",
  description:
    "Reseror is your premium travel companion — offering curated destinations, seamless room bookings, brand collaborations, 24/7 support, and expert travel articles.",
};

const stats = [
  { value: "190+", label: "Countries Covered" },
  { value: "2.4M+", label: "Happy Travellers" },
  { value: "850K+", label: "Properties Listed" },
  { value: "24/7", label: "Live Support" },
];

const services = [
  {
    title: "Travel Destinations",
    desc: "Curated guides for every corner of the world — from hidden retreats to iconic landmarks, with verified reviews and insider tips.",
  },
  {
    title: "Room & Property Booking",
    desc: "Seamlessly book hotels, villas, boutique stays, and serviced apartments with transparent pricing and instant confirmation.",
  },
  {
    title: "Brand Collaborations",
    desc: "Strategic partnerships with leading travel brands to bring you exclusive rates, perks, and curated experiences.",
  },
  {
    title: "24/7 Support",
    desc: "Our global support team is always on standby — live chat, phone, and email — ensuring every trip runs without a hitch.",
  },
  {
    title: "Travel Articles & Guides",
    desc: "Expert-written content covering travel tips, destination deep-dives, packing guides, and seasonal recommendations.",
  },
  {
    title: "Group & Corporate Travel",
    desc: "Tailored solutions for business travel and group bookings with dedicated account management and custom pricing.",
  },
];

const values = [
  {
    number: "01",
    title: "Transparency",
    desc: "No hidden fees, no surprises. Every price, policy, and detail is clear from the start.",
  },
  {
    number: "02",
    title: "Trust",
    desc: "Verified properties, authenticated reviews, and secure payments you can rely on.",
  },
  {
    number: "03",
    title: "Accessibility",
    desc: "Premium travel experiences designed for every type of explorer and every budget.",
  },
  {
    number: "04",
    title: "Innovation",
    desc: "Continuous investment in technology to make planning and booking effortlessly smooth.",
  },
];

const partners = ["Marriott", "Hilton", "IHG", "Accor", "Radisson", "Wyndham"];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4"
        style={{ background: "linear-gradient(140deg, #07143d 0%, #0e2460 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-5"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            Our Story
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-xl leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Travel Redefined for the Modern Explorer
          </h1>
          <p className="text-white/50 text-base max-w-lg leading-relaxed mb-8">
            Reseror is a premium travel platform built to connect curious minds
            with extraordinary places — seamlessly, transparently, and at scale.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hotels"
              className="px-6 py-3 rounded-xl text-sm font-bold text-[#07143d] transition-opacity hover:opacity-90"
              style={{ background: "#f59e0b" }}
            >
              Explore Destinations
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-white border-b" style={{ borderColor: "#efefef" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 divide-x" style={{ divideColor: "#efefef" }}>
          {stats.map((s) => (
            <div key={s.label} className="py-8 px-6 text-center">
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Mission */}
        <section className="py-16 border-b" style={{ borderColor: "#efefef" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-3">
                Our Mission
              </span>
              <h2
                className="text-3xl font-bold mb-5 leading-snug"
                style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
              >
                Making the World Accessible, One Journey at a Time
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Founded in 2019, Reseror was built on a single conviction: that booking
                extraordinary travel should be as inspiring as the trip itself. We saw a
                market dominated by complexity and hidden costs — and built the alternative.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Today we serve millions of travellers across 190+ countries, offering
                real-time inventory, trusted reviews, and partnerships with the world's
                leading hospitality brands — all in one transparent platform.
              </p>
            </div>
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-3 py-14"
              style={{ background: "rgba(7,20,61,0.04)", border: "1px solid #efefef" }}
            >
              <Image
                src="/assets/reseror.png"
                alt="Reseror"
                width={180}
                height={60}
                className="object-contain opacity-80"
                style={{ height: "auto" }}
              />
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: "#07143d" }}>2019</div>
                  <div className="text-xs text-gray-400 mt-0.5">Founded</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: "#07143d" }}>850K+</div>
                  <div className="text-xs text-gray-400 mt-0.5">Listings</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: "#07143d" }}>190+</div>
                  <div className="text-xs text-gray-400 mt-0.5">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 border-b" style={{ borderColor: "#efefef" }}>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-3">
            What We Offer
          </span>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2
              className="text-3xl font-bold leading-snug"
              style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
            >
              Everything You Need,<br />Under One Roof
            </h2>
            <p className="text-gray-400 text-sm max-w-xs">
              From inspiration to booking confirmation, Reseror covers every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="bg-[#f8f7f4] p-7"
              >
                <div
                  className="text-xs font-bold text-gray-300 mb-4"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-16 border-b" style={{ borderColor: "#efefef" }}>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-3">
            What We Stand For
          </span>
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "#07143d", fontFamily: "'Playfair Display', serif" }}
          >
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex gap-5 p-6 rounded-2xl bg-white"
                style={{ border: "1px solid #efefef" }}
              >
                <div
                  className="text-2xl font-bold flex-shrink-0 leading-none mt-0.5"
                  style={{ color: "#f3f0ea", fontFamily: "'Playfair Display', serif" }}
                >
                  {v.number}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="py-14 border-b" style={{ borderColor: "#efefef" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center mb-8">
            Trusted Brand Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partners.map((p) => (
              <div
                key={p}
                className="px-6 py-2.5 rounded-xl bg-white text-sm font-semibold text-gray-500"
                style={{ border: "1px solid #efefef" }}
              >
                {p}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* CTA */}
      <section className="px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl px-8 md:px-14 py-12 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(130deg, #07143d, #0e2460)" }}
          >
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ready to Start Your Next Adventure?
              </h2>
              <p className="text-white/45 text-sm">
                Join over 2.4 million travellers who trust Reseror.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                href="/hotels"
                className="px-6 py-3 rounded-xl text-sm font-bold text-[#07143d] hover:opacity-90 transition-opacity"
                style={{ background: "#f59e0b" }}
              >
                Start Exploring
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)" }}
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}