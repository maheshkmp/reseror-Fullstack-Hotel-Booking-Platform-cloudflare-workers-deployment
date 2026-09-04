"use client";

import { motion, Variants } from "framer-motion";

const MotionDiv = motion.div as any;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export function DownloadApp() {
  return (
    <section className="relative bg-[#07143d] overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10 sm:py-14">
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col-reverse sm:flex-row items-center gap-8 sm:gap-12"
        >
          {/* ── Text side ── */}
          <div className="flex-1 text-white text-center sm:text-left">

            <MotionDiv custom={0} variants={fadeUp}>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-blue-300/70 mb-3 block">
                Mobile App
              </span>
            </MotionDiv>

            <MotionDiv custom={1} variants={fadeUp}>
              <h2
                className="text-3xl sm:text-4xl font-bold leading-[1.15] mb-3 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Travel in your pocket
              </h2>
            </MotionDiv>
            <MotionDiv custom={2} variants={fadeUp}>
              <p className="text-[15px] text-blue-100/60 leading-relaxed mb-6 max-w-sm mx-auto sm:mx-0">
                Book trips, get exclusive deals, and manage your journeys — all from the Reseror app.
              </p>
            </MotionDiv>

            {/* Store buttons — label only */}
            <MotionDiv
              custom={3}
              variants={fadeUp}
              className="flex flex-row gap-3 justify-center sm:justify-start"
            >
              {[
                { eyebrow: "Download on the", label: "App Store" },
                { eyebrow: "Get it on", label: "Google Play" },
              ].map(({ eyebrow, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex flex-col items-center sm:items-start bg-white/[0.07] hover:bg-white/[0.11] border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-[9px] uppercase tracking-[0.12em] font-semibold text-blue-300/60 leading-none mb-[4px]">
                    {eyebrow}
                  </span>
                  <span className="text-[14px] font-bold leading-none text-white">
                    {label}
                  </span>
                </a>
              ))}
            </MotionDiv>
          </div>

          {/* ── Phone mockup ── */}
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="flex-shrink-0"
          >
            {/* w-[110px] on mobile, w-[152px] on sm+ */}
            <div className="w-[114px] sm:w-[152px] aspect-[9/17.5] bg-[#161616] rounded-[1.8rem] sm:rounded-[2rem] p-[7px] sm:p-[9px] shadow-[0_16px_48px_-8px_rgba(0,0,0,0.55)] ring-1 ring-white/10 relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-15 h-3.5 bg-[#161616] rounded-b-xl z-20" />
              {/* Screen */}
              <div className="w-full h-full bg-slate-900 rounded-[1.4rem] sm:rounded-[1.6rem] overflow-hidden">
                <img
                  src="/assets/mobile-app.png"
                  alt="Reseror App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}