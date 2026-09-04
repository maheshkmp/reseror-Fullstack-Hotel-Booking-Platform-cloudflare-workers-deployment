import { Lock, Headset, Star, BadgeDollarSign } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    description: "Find it cheaper? We'll match it.",
    accent: "#2563EB",
  },
  {
    icon: Lock,
    title: "Secure Booking",
    description: "256-bit SSL on every transaction.",
    accent: "#1E3A5F",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Help whenever you need it.",
    accent: "#059669",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Real ratings from real travelers.",
    accent: "#7C3AED",
  },
];

export function TrustSection() {
  return (
    <section className="py-10 px-4 md:px-6 lg:px-8 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-2 px-5 py-7 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Icon
                  style={{ color: item.accent }}
                  className="w-5 h-5 mb-1 shrink-0"
                  strokeWidth={1.75}
                />
                <h3 className="font-semibold text-[#1E3A5F] text-sm leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}