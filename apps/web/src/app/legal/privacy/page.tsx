import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Link from "next/link";

const sections = [
  {
    number: "1",
    title: "Information We Collect",
    content:
      "We collect personal information you provide directly — such as your name, email address, phone number, and payment details during booking. We also collect usage data automatically, including pages visited, device information, and IP address, to improve our platform and your experience.",
  },
  {
    number: "2",
    title: "How We Use Your Information",
    content:
      "Your information is used to process bookings and payments, communicate important service updates, personalise your experience, and send relevant promotions where you have given consent. We do not use your data for purposes beyond those described in this policy without your explicit permission.",
  },
  {
    number: "3",
    title: "Sharing of Information",
    content:
      "We do not sell your personal data. We share it only with trusted third-party providers who assist in operating our platform — such as payment gateways and cloud infrastructure — under strict confidentiality agreements, and with law enforcement when required by applicable law.",
  },
  {
    number: "4",
    title: "Cookies & Tracking",
    content:
      "Reseror uses cookies and similar tracking technologies to remember your preferences, maintain session security, and analyse website traffic. You may disable cookies through your browser settings at any time, though some features may be affected.",
  },
  {
    number: "5",
    title: "Data Security",
    content:
      "We implement industry-standard security measures including SSL encryption and PCI-DSS compliant payment processing to safeguard your personal data. While we take all reasonable precautions, no online transmission can be guaranteed to be 100% secure.",
  },
  {
    number: "6",
    title: "Your Rights",
    content:
      "Depending on your jurisdiction, you may have the right to access, correct, restrict processing of, or request deletion of your personal data. To exercise any of these rights, please contact our support team at info@reseror.com.",
  },
  {
    number: "7",
    title: "Children's Privacy",
    content:
      "Reseror does not knowingly collect personal data from individuals under the age of 13. If we become aware that such data has been collected inadvertently, we will take prompt steps to delete it from our records.",
  },
  {
    number: "8",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy periodically to reflect changes in our practices or applicable regulations. The \"Last Updated\" date at the top of this page will be revised accordingly. Where changes are material, we will notify you by email or via a notice on our platform.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-16 px-4"
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
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-4"
            style={{
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
          >
            Legal
          </span>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">Last Updated: August 2025</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar TOC */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.number}
                    href={`#section-${s.number}`}
                    className="flex items-center gap-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-800 transition-colors group"
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: "rgba(7,20,61,0.06)", color: "#9ca3af" }}
                    >
                      {s.number}
                    </span>
                    <span className="leading-tight">{s.title}</span>
                  </a>
                ))}
              </nav>

              <div
                className="mt-10 pt-8"
                style={{ borderTop: "1px solid #e8e6e0" }}
              >
                <p className="text-xs text-gray-400 mb-3">
                  Questions about this policy?
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-bold underline underline-offset-2 hover:text-amber-600 transition-colors"
                  style={{ color: "#07143d" }}
                >
                  Contact our team →
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            {/* Intro */}
            <div
              className="rounded-xl px-6 py-5 mb-10 text-sm text-gray-600 leading-relaxed"
              style={{
                background: "rgba(7,20,61,0.04)",
                border: "1px solid #e8e6e0",
              }}
            >
              At Reseror, your privacy is fundamental to how we operate. This
              Privacy Policy explains how we collect, use, disclose, and protect
              your personal information when you use our website and services.
              Please read it carefully.
            </div>

            {/* Sections */}
            <div className="space-y-0">
              {sections.map((s, i) => (
                <div
                  key={s.number}
                  id={`section-${s.number}`}
                  className="py-8"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #e8e6e0",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: "rgba(7,20,61,0.07)", color: "#07143d" }}
                    >
                      {s.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-base font-bold mb-3"
                        style={{ color: "#07143d" }}
                      >
                        {s.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {s.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div
              className="mt-10 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "linear-gradient(130deg, #07143d, #0e2460)" }}
            >
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">
                  Have a privacy concern?
                </p>
                <p className="text-white/45 text-xs">
                  Our team responds within 2 business hours.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-[#07143d] hover:opacity-90 transition-opacity"
                style={{ background: "#f59e0b" }}
              >
                Contact Support
              </Link>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}