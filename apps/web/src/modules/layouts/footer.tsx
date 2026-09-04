"use client";

import { Facebook, Instagram, Mail, MapPin, Twitter, Youtube, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGetSettings } from "@/features/admin/settings/api/use-get-settings";

export function Footer() {
  const { data: settings } = useGetSettings();

  const footerSections = [
    {
      title: "Solutions",
      links: [
        { label: "Search Hotels", href: "/search" },
        { label: "Deals & Offers", href: "/deals" },
        { label: "Destinations", href: "/destinations" },
        { label: "Travel Guide", href: "/guide" },
        { label: "List your Property", href: "/setup-organization?mode=hotelOwner" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/legal/faqs" },
        { label: "Check Status", href: "/status" },
      ],
    },
    {
      title: "Transparency",
      links: [
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Cookie Policy", href: "/legal/cookies" },
        { label: "Security", href: "/legal/security" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Linkedin, href: "#", label: "Linkedin" },
  ];

  const contactLinks = [
    { label: settings?.contactEmail || "info@reseror.com", href: `mailto:${settings?.contactEmail || "info@reseror.com"}`, icon: Mail },
    { label: settings?.contactAddress || "Colombo, Sri Lanka", href: "#", icon: MapPin },
  ];

  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{ background: "linear-gradient(160deg, #07143d 0%, #0b1e55 50%, #07143d 100%)" }}
    >
      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow top-right */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Ambient glow bottom-left */}
      <div
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* ── Top strip: brand + tagline + socials ── */}
        <div
          className="border-b px-6 md:px-12 lg:px-20 py-10"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Logo + tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-2"
            >
              <Link href="/" className="block">
                <span className="font-extrabold text-2xl md:text-3xl tracking-tight text-white opacity-95 hover:opacity-100 transition-opacity">
                  Reseror
                </span>
              </Link>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Your trusted companion for finding the perfect stay, anywhere in the world.
              </p>
            </motion.div>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 group"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(251,191,36,0.15)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <s.icon size={15} className="text-white/50 group-hover:text-amber-400 transition-colors" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Main links grid ── */}
        <div className="px-6 md:px-12 lg:px-20 py-14">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {footerSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="space-y-5"
              >
                <h5
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#f59e0b" }}
                >
                  {section.title}
                </h5>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1.5 text-white/45 hover:text-white text-sm transition-all duration-200"
                      >
                        <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                          <ArrowUpRight size={11} className="text-amber-400 flex-shrink-0" />
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact column */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="space-y-5"
            >
              <h5
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: "#f59e0b" }}
              >
                Get in Touch
              </h5>
              <ul className="space-y-4">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-3 text-white/45 hover:text-white text-sm transition-colors duration-200"
                    >
                      <span
                        className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <link.icon size={13} className="text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                      </span>
                      <span className="leading-tight">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="px-6 md:px-12 lg:px-20 py-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs tracking-wide">
              {settings?.copyrightText || "© 2026 Reseror · Marriex PVT LTD. All rights reserved."}
            </p>
            <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-widest text-white/25">
              {[
                { label: "Privacy", href: "/legal/privacy" },
                { label: "Terms", href: "/legal/terms" },
                { label: "Security", href: "/legal/security" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-amber-400 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}