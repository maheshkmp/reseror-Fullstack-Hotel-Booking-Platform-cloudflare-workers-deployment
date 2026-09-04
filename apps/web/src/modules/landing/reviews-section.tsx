import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Amara Perera",
    location: "Colombo, Sri Lanka",
    rating: 5,
    text: "Reseror made our honeymoon unforgettable! Found the perfect beachfront villa in Mirissa — steps from the ocean, gorgeous views, and seamless booking within minutes.",
    stay: "Mirissa Beach Villa",
    avatar: "AP",
    avatarColor: "bg-blue-600",
  },
  {
    id: 2,
    name: "James Thornton",
    location: "London, UK",
    rating: 5,
    text: "Incredible platform! Best price guarantee saved me over $200 compared to other sites. The hotel in Kandy was stunning and exactly as described. Will definitely book again.",
    stay: "Temple View Boutique",
    avatar: "JT",
    avatarColor: "bg-[#1E3A5F]",
  },
  {
    id: 3,
    name: "Priya Nair",
    location: "Mumbai, India",
    rating: 5,
    text: "Support team was phenomenal — helped us upgrade our room at midnight! The verified reviews gave us total confidence. This is now our go-to travel booking platform.",
    stay: "Galle Fort Heritage Hotel",
    avatar: "PN",
    avatarColor: "bg-emerald-600",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-3 tracking-wide uppercase">
            Guest Reviews
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What our travelers say
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Join 1000+ happy guests who've discovered their perfect stay
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Stay badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-[#1E3A5F] bg-blue-50 px-3 py-1 rounded-full font-medium">
                  📍 {review.stay}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div
                  className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {review.name}
                  </p>
                  <p className="text-gray-500 text-xs">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-3 gap-6 py-8 border-t border-gray-100">
          {[
            { value: "1000+", label: "Happy Guests" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "150+", label: "Verified Properties" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-bold text-[#1E3A5F] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
