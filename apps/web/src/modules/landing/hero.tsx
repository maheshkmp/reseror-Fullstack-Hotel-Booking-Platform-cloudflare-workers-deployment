import HotelSearchComponent from "@/features/hotels/components/advanced-search";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden min-h-[460px]">
      {/* Background Image with clean gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.jpg"
          alt="Beautiful destination"
          fill
          priority
          className="object-cover"
        />
        {/* Dark gradient overlay for readable contrast */}
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(160deg, rgba(7, 20, 61, 0.85) 0%, rgba(11, 30, 85, 0.85) 50%, rgba(7, 20, 61, 0.9) 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 md:px-6 text-center font-['DM_Sans',sans-serif]">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl text-white font-extrabold leading-tight mb-3 tracking-tight">
            Find stays for your next trip
          </h1>
          <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto">
            Search deals on luxury hotels, beachfront villas, dining & more...
          </p>
        </div>

        {/* Glassy Border Search Wrapper */}
        <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-2.5 rounded-2xl shadow-2xl">
          <div className="bg-white p-1.5 rounded-xl shadow-md overflow-hidden">
            <HotelSearchComponent />
          </div>
        </div>
      </div>
    </section>
  );
}
