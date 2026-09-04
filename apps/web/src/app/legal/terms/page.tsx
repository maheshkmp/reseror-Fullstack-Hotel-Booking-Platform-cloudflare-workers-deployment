import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Link from "next/link";

const sections = [
  {
    number: "1",
    title: "Acceptance of Terms",
    content:
      "By accessing or using Reseror, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must discontinue use of our services immediately.",
  },
  {
    number: "2",
    title: "Eligibility",
    content:
      "You must be at least 13 years old, or the age of majority in your jurisdiction, to use our services. If you are under this age, you may only use Reseror with the explicit consent and supervision of a parent or legal guardian.",
  },
  {
    number: "3",
    title: "User Responsibilities",
    content:
      "You agree to provide accurate and up-to-date information during registration, maintain the security of your account credentials, refrain from engaging in unlawful, harmful, or abusive activities, and respect the intellectual property rights of Reseror and third parties.",
  },
  {
    number: "4",
    title: "Prohibited Activities",
    content:
      "You agree not to misuse our services in any way, including attempting to gain unauthorised access to our systems, distributing malware or malicious code, engaging in fraudulent transactions, or using automated tools to scrape or abuse our platform.",
  },
  {
    number: "5",
    title: "Intellectual Property",
    content:
      "All content, trademarks, logos, and data on Reseror are owned by or licensed to Reseror and are protected under applicable intellectual property law. You may not use, copy, reproduce, or distribute any of these materials without prior written permission.",
  },
  {
    number: "6",
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by applicable law, Reseror shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you in the preceding twelve months.",
  },
  {
    number: "7",
    title: "Termination",
    content:
      "We reserve the right to suspend or permanently terminate your access to our services at our sole discretion, without prior notice, if you violate these Terms or engage in conduct that is harmful to Reseror, its users, or third parties.",
  },
  {
    number: "8",
    title: "Changes to Terms",
    content:
      "We may revise these Terms from time to time to reflect changes in our services or legal obligations. The updated version will be posted on this page with a revised \"Last Updated\" date. Continued use of our services after changes are posted constitutes your acceptance of the updated Terms.",
  },
];

export default function TermsOfUse() {
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
            Terms of Use
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
                    className="flex items-center gap-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-800 transition-colors"
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

              <div className="mt-10 pt-8" style={{ borderTop: "1px solid #e8e6e0" }}>
                <p className="text-xs text-gray-400 mb-3">
                  Questions about these terms?
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
              These Terms of Use govern your access to and use of Reseror's website, applications, and services. By accessing or using our services, you agree to comply with these Terms. Please read them carefully before proceeding.
            </div>

            {/* Sections */}
            <div>
              {sections.map((s, i) => (
                <div
                  key={s.number}
                  id={`section-${s.number}`}
                  className="py-8"
                  style={{ borderTop: i === 0 ? "none" : "1px solid #e8e6e0" }}
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
                  Questions about these Terms?
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