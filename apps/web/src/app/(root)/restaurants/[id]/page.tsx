"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClient } from "@/lib/rpc/client";
import { AlertCircle, Calendar, Users, Clock, Info, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useCreateRestaurantBooking } from "@/features/resturant/hooks/use-create-restaurant-booking";

// Google Maps component
const GoogleMap = ({
  address,
  lat,
  lng,
}: {
  address: string;
  lat?: number;
  lng?: number;
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if ((window as any).google) {
        setMapLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key is not configured");
        setMapLoaded(true); // Set to true anyway to avoid blocking UI
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setMapLoaded(true); // Set to true to avoid blocking UI
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapLoaded && (window as any).google) {
      const mapContainer = document.getElementById("google-map");
      if (mapContainer) {
        const latitude = Number(lat);
        const longitude = Number(lng);

        // Use provided coordinates or geocode the address
        if (lat && lng && !isNaN(latitude) && !isNaN(longitude)) {
          initializeMap(latitude, longitude);
        } else {
          // Geocode the address to get coordinates
          const geocoder = new (window as any).google.maps.Geocoder();
          geocoder.geocode({ address }, (results: any, status: string) => {
            if (status === "OK" && results && results[0]) {
              const location = results[0].geometry.location;
              initializeMap(location.lat(), location.lng());
            } else {
              // Fallback to a default location or show error
              console.error("Geocoding failed:", status);
            }
          });
        }
      }
    }
  }, [mapLoaded, address, lat, lng]);

  const initializeMap = (latitude: number, longitude: number) => {
    const mapContainer = document.getElementById("google-map");
    if (mapContainer && (window as any).google) {
      const map = new (window as any).google.maps.Map(mapContainer, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Add marker
      new (window as any).google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "Restaurant Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.477 2 6 6.477 6 12C6 20 16 30 16 30S26 20 26 12C26 6.477 21.523 2 16 2Z" fill="#DC2626"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 32),
        },
      });
    }
  };

  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      {!mapLoaded ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      ) : (
        <div id="google-map" className="w-full h-full"></div>
      )}
    </div>
  );
};

const RestaurantDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  // Booking State
  const [bookingDate, setBookingDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [bookingTime, setBookingTime] = useState<string>("19:00");
  const [numChairs, setNumChairs] = useState<number>(2);
  const [isBooking, setIsBooking] = useState(false);

  const { data: session } = authClient.useSession();
  const { mutateAsync: createBooking } = useCreateRestaurantBooking();

  const handleBooking = async () => {
    if (!session) {
      toast.error("Authentication Required", {
        description: "Please login to book a table."
      });
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }
    
    if (!restaurant) return;
    
    setIsBooking(true);
    try {
      const pricePerSeat = parseFloat(restaurant.pricePerSeat || "0");
      const totalDeposit = (numChairs * pricePerSeat).toFixed(2);
      
      await createBooking({
        restaurantId,
        numberOfChairs: numChairs,
        bookingDate: new Date(`${bookingDate}T${bookingTime}`),
        totalDeposit: totalDeposit,
        status: "pending",
        checkInAt: null,
        paymentId: null,
        refundId: null,
      });
      
      toast.success("Booking Request Sent!", {
        description: `Reserved ${numChairs} chairs for ${bookingDate} at ${bookingTime}.`
      });
    } catch (error: any) {
      toast.error("Booking Failed", {
        description: error.message || "Failed to create your reservation."
      });
    } finally {
      setIsBooking(false);
    }
  };

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant-detail", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant[":id"].$get({
        param: { id: restaurantId },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurant");
      return res.json();
    },
  });

  const {
    data: images,
    isLoading: loadingImages,
    error: errorImages,
  } = useQuery({
    queryKey: ["restaurant-images", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant[":id"].images.$get({
        param: { id: restaurantId },
        query: {
          page: "",
          limit: "",
          sort: "desc",
          search: "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch restaurant images");
      const result = await res.json();
      return (result as any).data;
    },
  });

  if (isLoading || loadingImages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-96 w-full rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="text-red-600 text-lg font-semibold">
            Failed to load restaurant details.
          </div>
          <div className="text-red-500 text-sm mt-2">
            Please try again later
          </div>
        </div>
      </div>
    );
  }

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>Restaurant</span>
                  <span>•</span>
                  <span>
                    {restaurant.city}, {restaurant.country}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {restaurant.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  {restaurant.starRating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStarRating(restaurant.starRating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.starRating} out of 5
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        restaurant.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {restaurant.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {restaurant.street}, {restaurant.city}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {images && images.length > 0 && (
          <div className="bg-white">
            <div className="px-6 py-6">
              <div className="grid grid-cols-4 gap-2 h-96">
                {/* Main large image */}
                {images[0] && (
                  <div
                    className="col-span-2 cursor-pointer group relative rounded-lg overflow-hidden"
                    onClick={() => setSelectedImage(images[0])}
                  >
                    <Image
                      src={getImageUrl(images[0].imageUrl)}
                      alt={images[0].altText || restaurant.name}
                      fill
                      className="object-cover group-hover:brightness-90 transition-all duration-200"
                    />
                  </div>
                )}

                {/* Side images */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  {images.slice(1, 5).map((img: any, index: number) => (
                    <div
                      key={img.id}
                      className={`cursor-pointer group relative rounded-lg overflow-hidden ${
                        index === 3 && images.length > 5 ? "relative" : ""
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={getImageUrl(img.imageUrl)}
                        alt={img.altText || restaurant.name}
                        fill
                        className="object-cover group-hover:brightness-90 transition-all duration-200"
                      />
                      {/* Show "+X more" overlay on last image if there are more images */}
                      {index === 3 && images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            +{images.length - 5} photos
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* View all photos button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedImage(images[0])}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  View all {images.length} photos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Popup Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = images.findIndex(
                        (img: any) => img.id === selectedImage.id
                      );
                      const prevIndex =
                        currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                      setSelectedImage(images[prevIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = images.findIndex(
                        (img: any) => img.id === selectedImage.id
                      );
                      const nextIndex =
                        currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(images[nextIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Main image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10">
                <Image
                  src={getImageUrl(selectedImage.imageUrl)}
                  alt={selectedImage.altText || restaurant.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-sm text-white p-4 rounded-xl">
                <div className="font-semibold">
                  {selectedImage.altText || restaurant.name}
                </div>
                <div className="text-sm opacity-80">
                  {images.findIndex((img: any) => img.id === selectedImage.id) +
                    1}{" "}
                  of {images.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white">
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content - Restaurant Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About this restaurant
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {restaurant.description ||
                        "No description available for this restaurant."}
                    </p>
                  </div>
                </div>

                {/* Pricing Information */}
                {(restaurant.breakfastPrice || restaurant.lunchPrice || restaurant.dinnerPrice || restaurant.buffetPrice) && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.breakfastPrice && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="font-medium text-gray-900">Breakfast</span>
                          <span className="text-lg font-bold text-blue-600">${restaurant.breakfastPrice}</span>
                        </div>
                      )}
                      {restaurant.lunchPrice && (
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <span className="font-medium text-gray-900">Lunch</span>
                          <span className="text-lg font-bold text-green-600">${restaurant.lunchPrice}</span>
                        </div>
                      )}
                      {restaurant.dinnerPrice && (
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="font-medium text-gray-900">Dinner</span>
                          <span className="text-lg font-bold text-purple-600">${restaurant.dinnerPrice}</span>
                        </div>
                      )}
                      {restaurant.buffetPrice && (
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <span className="font-medium text-gray-900">Buffet</span>
                          <span className="text-lg font-bold text-orange-600">${restaurant.buffetPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Restaurant Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Restaurant highlights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Opening Hours
                        </div>
                        <div className="text-sm text-gray-600">
                          {restaurant.checkInTime} - {restaurant.checkOutTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Contact</div>
                        <div className="text-sm text-gray-600">
                          {restaurant.phone || "Not available"}
                        </div>
                      </div>
                    </div>

                    {restaurant.brandName && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Brand</div>
                          <div className="text-sm text-gray-600">
                            {restaurant.brandName}
                          </div>
                        </div>
                      </div>
                    )}

                    {restaurant.website && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-orange-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Website
                          </div>
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit website
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Location
                  </h3>
                  <GoogleMap
                    address={`${restaurant.street}, ${restaurant.city}, ${restaurant.state}, ${restaurant.country}`}
                    lat={restaurant.latitude}
                    lng={restaurant.longitude}
                  />
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {restaurant.street}, {restaurant.city},{" "}
                        {restaurant.state} {restaurant.postalCode},{" "}
                        {restaurant.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    {/* Premium Header Decoration */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                    
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        Reserve a Table
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Instant confirmation • Secure booking
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> Booking Date
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Time
                          </label>
                          <select 
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                          >
                            {["11:00", "12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3 h-3" /> Chairs
                          </label>
                          <select 
                            value={numChairs}
                            onChange={(e) => setNumChairs(parseInt(e.target.value))}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                              <option key={n} value={n}>{n} {n === 1 ? "Chair" : "Chairs"}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Anti-Fraud Deposit Logic */}
                    {parseFloat(restaurant.pricePerSeat || "0") > 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 space-y-3">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <h4 className="text-[13px] font-bold text-blue-900 leading-none">Refundable Deposit</h4>
                            <p className="text-[11px] text-blue-800/70 mt-1.5 leading-relaxed">
                              A small deposit is required to secure your spot. This will be <strong>100% refunded</strong> upon your arrival.
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-blue-200/30 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Deposit Due</span>
                          <span className="text-sm font-bold text-blue-600">
                            ${(numChairs * parseFloat(restaurant.pricePerSeat || "0")).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleBooking}
                      loading={isBooking}
                      disabled={isBooking}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                      {parseFloat(restaurant.pricePerSeat || "0") > 0 ? "Pay Deposit & Book" : "Reserve Now"}
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Free Cancellation
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <div className="text-gray-900 font-medium">
                            Address
                          </div>
                          <div className="text-gray-600">
                            {restaurant.street}
                            <br />
                            {restaurant.city}, {restaurant.state}{" "}
                            {restaurant.postalCode}
                            <br />
                            {restaurant.country}
                          </div>
                        </div>
                      </div>

                      {restaurant.phone && (
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <div>
                            <div className="text-gray-900 font-medium">
                              Phone
                            </div>
                            <div className="text-gray-600">
                              {restaurant.phone}
                            </div>
                          </div>
                        </div>
                      )}

                      {restaurant.email && (
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <div>
                            <div className="text-gray-900 font-medium">
                              Email
                            </div>
                            <div className="text-gray-600">
                              {restaurant.email}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              {/* <div>Restaurant ID: {restaurantId}</div> */}
              <div className="flex items-center gap-4">
                <span>
                  Listed on{" "}
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </span>
                {restaurant.updatedAt && (
                  <span>
                    Updated{" "}
                    {new Date(restaurant.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
