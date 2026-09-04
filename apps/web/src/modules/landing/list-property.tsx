"use client";

import { useRouter } from "next/navigation";
import { DollarSign, LayoutDashboard, Users } from "lucide-react";

const FEATURES = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description: "Turn your property into a profitable investment with competitive rates and maximum visibility.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: LayoutDashboard,
    title: "Easy Management",
    description: "Simple dashboard to manage bookings, pricing, and guest communication effortlessly.",
    iconBg: "bg-blue-100",
    iconColor: "text-[#1E3A5F]",
  },
  {
    icon: Users,
    title: "24/7 Host Support",
    description: "Get dedicated support whenever you need it from our experienced host success team.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export function ListYourProperty() {
  const router = useRouter();

  return (
    <div className="bg-[#1E3A5F] flex flex-col w-full">
      
      {/* SECTION 1: Intro & Call To Action */}
      <section className="py-20 md:py-28 px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-5xl mx-auto">
          <span className="inline-flex items-center px-5 py-2 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded-full mb-8 tracking-widest uppercase">
            For Property Owners
          </span>
          
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            List your property
          </h2>
          
          <p className="text-blue-200/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of hosts earning extra income by listing their properties with Reseror. Experience seamless management and dedicated support.
          </p>
          
          <button
            onClick={() => router.push("/account")}
            className="group relative inline-flex items-center justify-center bg-[#07143d] hover:bg-white text-white hover:text-[#07143d] font-medium px-10 py-4 rounded-full border border-white/10 transition-colors duration-300 active:scale-95"
          >
            <span className="text-lg">List Your Property Now</span>
          </button>
        </div>
      </section>

      {/* PARALLAX DIVIDER */}
      <div
        className="h-48 md:h-80 w-full bg-fixed bg-center bg-cover relative border-y border-white/5"
        style={{
          // Using a high-quality real estate image for the parallax effect
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        {/* Color overlay to blend the image perfectly with the brand colors */}
        <div className="absolute inset-0 bg-[#1E3A5F]/80 mix-blend-multiply" />
        {/* Gradient fades at the top and bottom to seamlessly merge into the sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F] via-transparent to-[#1E3A5F]" />
      </div>

      {/* SECTION 2: Features Grid */}
      <section className="py-20 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2rem] p-8 md:p-10 transition-colors duration-300"
                >
                  <div className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center mb-8 transform group-hover:-translate-y-1 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${f.iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{f.title}</h3>
                  <p className="text-blue-200/70 text-base font-light leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
    </div>
  );
}