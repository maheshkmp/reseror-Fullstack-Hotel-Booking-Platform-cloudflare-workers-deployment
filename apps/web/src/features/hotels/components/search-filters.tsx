"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Star, Calendar, DollarSign, Award, Building2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useGetHotelTypes } from "../queries/use-get-hotel-types";
import { useGetPropertyClasses } from "../queries/use-get-property-classes";
import { PriceRangeSlider } from "./price-range-slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SearchFiltersProps {
  currentSearch?: string;
  currentHotelType?: string;
  currentPropertyClass?: string;
  currentRoomTypes?: string;
  currentBrandName?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSort?: string;
  availableBrands?: string[];
  currentViewTypes?: string;
  currentReviewScore?: string;
  currentFacilities?: string;
  currentTravelGroup?: string;
  currentTags?: string;
  currentStars?: string;
}

interface RoomType {
  id: string;
  name: string;
  hotelId: string;
  description?: string;
  price?: number;
  viewType?: string;
  bedConfiguration?: string;
}

const VIEW_TYPES = [
  { value: "ocean", label: "Sea view", icon: "🌊" },
  { value: "city", label: "City view", icon: "🏙️" },
  { value: "garden", label: "Garden view", icon: "🌸" },
  { value: "mountain", label: "Mountain view", icon: "🗻" },
  { value: "pool", label: "Pool view", icon: "🏊" },
  { value: "courtyard", label: "Courtyard view", icon: "🏰" },
];

const FACILITIES = [
  { value: "parking", label: "Parking" },
  { value: "swimming_pool", label: "Swimming pool" },
  { value: "spa", label: "Spa" },
  { value: "hot_tub", label: "Hot tub / Jacuzzi" },
  { value: "free_wifi", label: "Free WiFi" },
  { value: "air_conditioning", label: "Air conditioning" },
  { value: "restaurant", label: "Restaurant" },
  { value: "gym", label: "Fitness center" },
  { value: "beach_access", label: "Beach / Pool access" },
  { value: "room_service", label: "Room service" },
  { value: "ev_charging", label: "Electric vehicle charging" },
  { value: "airport_shuttle", label: "Airport shuttle" },
  { value: "bar", label: "Bar / Lounge" },
];

const TRAVEL_GROUP = [
  { value: "pet_friendly", label: "Pet friendly" },
  { value: "adults_only", label: "Adults only" },
];

const REVIEW_SCORES = [
  { value: "9", label: "Wonderful", sublabel: "9+" },
  { value: "8", label: "Very Good", sublabel: "8+" },
  { value: "7", label: "Good", sublabel: "7+" },
  { value: "6", label: "Pleasant", sublabel: "6+" },
];

const STAR_RATINGS = [5, 4, 3, 2, 1];

function FilterSection({
  title,
  children,
  value,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  value: string;
  icon?: any;
}) {
  return (
    <AccordionItem value={value} className="border-b border-gray-100 px-5">
      <AccordionTrigger className="hover:no-underline py-4 group">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#004BD7] transition-colors" />}
          <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-5">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function FilterCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  sublabel,
  count,
  icon,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group py-1.5"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#004BD7] data-[state=checked]:border-[#004BD7] rounded transition-all"
      />
      {icon && <span className="text-base leading-none shrink-0">{icon}</span>}
      <span className="text-[13px] text-gray-700 group-hover:text-[#004BD7] transition-all flex-1 leading-tight font-medium">
        {label}
        {sublabel && (
          <span className="text-gray-400 font-normal ml-1.5">({sublabel})</span>
        )}
      </span>
      {count !== undefined && (
        <span className="text-[10px] text-gray-400 shrink-0 tabular-nums font-bold">{count}</span>
      )}
    </label>
  );
}

export function SearchFilters({
  currentSearch = "",
  currentHotelType = "",
  currentPropertyClass = "",
  currentRoomTypes = "",
  currentBrandName = "",
  currentMinPrice = "",
  currentMaxPrice = "",
  currentSort = "desc",
  availableBrands = [],
  currentViewTypes = "",
  currentReviewScore = "",
  currentFacilities = "",
  currentTravelGroup = "",
  currentTags = "",
  currentStars = "",
}: SearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);
  const [hotelType, setHotelType] = useState(currentHotelType);
  const [propertyClass, setPropertyClass] = useState(currentPropertyClass);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(
    currentRoomTypes ? currentRoomTypes.split(",").filter(Boolean) : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    currentBrandName ? currentBrandName.split(",").filter(Boolean) : []
  );
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [sort, setSort] = useState(currentSort);
  const [selectedViewTypes, setSelectedViewTypes] = useState<string[]>(
    currentViewTypes ? currentViewTypes.split(",").filter(Boolean) : []
  );
  const [selectedStars, setSelectedStars] = useState<number[]>(
    currentStars ? currentStars.split(",").filter(Boolean).map(Number) : []
  );
  const [reviewScore, setReviewScore] = useState(currentReviewScore);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    currentFacilities ? currentFacilities.split(",").filter(Boolean) : []
  );
  const [travelGroup, setTravelGroup] = useState<string[]>(
    currentTravelGroup ? currentTravelGroup.split(",").filter(Boolean) : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentTags ? currentTags.split(",").filter(Boolean) : []
  );

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [showAllRoomTypes, setShowAllRoomTypes] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const { data: hotelTypes, isPending: loadingHotelTypes } = useGetHotelTypes();
  const { data: propertyClasses, isPending: loadingPropertyClasses } =
    useGetPropertyClasses();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRoomTypes(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/types?page=1&limit=1000&sort=desc`
        );
        if (response.ok) {
          const data = await response.json();
          const uniqueRoomTypes = data.data.reduce(
            (acc: RoomType[], roomType: RoomType) => {
              const exists = acc.find(
                (rt) => rt.name.toLowerCase() === roomType.name.toLowerCase()
              );
              if (!exists) acc.push(roomType);
              return acc;
            },
            []
          );
          setRoomTypes(
            uniqueRoomTypes.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            )
          );
          const pricesWithValues = data.data
            .map((rt: RoomType) => rt.price)
            .filter((price: number | null) => price !== null && price > 0);
          if (pricesWithValues.length > 0) {
            setPriceRange({
              min: Math.floor(Math.min(...pricesWithValues)),
              max: Math.ceil(Math.max(...pricesWithValues)),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };
    fetchRoomTypes();
  }, []);

  const buildParams = (overrides: { search?: string } = {}) => {
    const params = new URLSearchParams();
    const s = overrides.search !== undefined ? overrides.search : search;
    if (s) params.set("search", s);
    if (hotelType) params.set("hotelType", hotelType);
    if (propertyClass) params.set("propertyClass", propertyClass);
    if (selectedRoomTypes.length > 0)
      params.set("roomTypes", selectedRoomTypes.join(","));
    if (selectedBrands.length > 0)
      params.set("brandName", selectedBrands.join(","));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (selectedViewTypes.length > 0)
      params.set("viewTypes", selectedViewTypes.join(","));
    if (selectedStars.length > 0)
      params.set("stars", selectedStars.join(","));
    if (reviewScore) params.set("reviewScore", reviewScore);
    if (selectedFacilities.length > 0)
      params.set("facilities", selectedFacilities.join(","));
    if (travelGroup.length > 0)
      params.set("travelGroup", travelGroup.join(","));
    if (selectedTags.length > 0)
      params.set("tags", selectedTags.join(","));
    return params;
  };

  // Debounce search input (500ms), immediate for all other filters
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(`/search?${buildParams().toString()}`, { scroll: false });
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    startTransition(() => {
      router.push(`/search?${buildParams().toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hotelType,
    propertyClass,
    selectedRoomTypes,
    selectedBrands,
    minPrice,
    maxPrice,
    sort,
    selectedViewTypes,
    selectedStars,
    reviewScore,
    selectedFacilities,
    travelGroup,
    selectedTags,
  ]);

  const handleClearFilters = () => {
    setSearch("");
    setHotelType("");
    setPropertyClass("");
    setSelectedRoomTypes([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("desc");
    setSelectedViewTypes([]);
    setSelectedStars([]);
    setReviewScore("");
    setSelectedFacilities([]);
    setTravelGroup([]);
    setSelectedTags([]);
    startTransition(() => {
      router.push("/search", { scroll: false });
    });
  };

  const toggleList = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const activeFilterCount =
    (search ? 1 : 0) +
    (hotelType ? 1 : 0) +
    (propertyClass ? 1 : 0) +
    selectedRoomTypes.length +
    selectedBrands.length +
    selectedViewTypes.length +
    selectedStars.length +
    selectedFacilities.length +
    travelGroup.length +
    selectedTags.length +
    (reviewScore ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const visibleRoomTypes = showAllRoomTypes ? roomTypes : roomTypes.slice(0, 5);
  const visibleFacilities = showAllFacilities ? FACILITIES : FACILITIES.slice(0, 5);
  const visibleBrands = showAllBrands ? availableBrands : availableBrands.slice(0, 5);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-gray-900">Filter by</h3>
          {isPending && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[11px] text-[#004BD7] hover:underline font-black uppercase tracking-wider"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none no-scrollbar">
        <Accordion type="multiple" defaultValue={["search", "budget", "stars", "facilities", "highlights"]} className="w-full">
          <form>
            <FilterSection title="Search by name" value="search" icon={Search}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="e.g. Marriott, Hilton..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 text-sm border-gray-200 rounded-xl font-medium"
              />
            </div>
          </FilterSection>

          <FilterSection title="Your budget (per night)" value="budget" icon={DollarSign}>
            <p className="text-xs text-gray-500 mb-4 font-medium">
              {minPrice && maxPrice
                ? `$${minPrice} – $${maxPrice}`
                : `Up to $${priceRange.max}`}
            </p>
            <PriceRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              defaultValue={[
                currentMinPrice ? parseFloat(currentMinPrice) : priceRange.min,
                currentMaxPrice ? parseFloat(currentMaxPrice) : priceRange.max,
              ]}
              onValueCommit={([min, max]) => {
                setMinPrice(min.toString());
                setMaxPrice(max.toString());
              }}
            />
          </FilterSection>

          <FilterSection title="Review score" value="reviews" icon={Award}>
            <div className="space-y-1">
              {REVIEW_SCORES.map((score) => (
                <FilterCheckbox
                  key={score.value}
                  id={`review-${score.value}`}
                  checked={reviewScore === score.value}
                  onCheckedChange={() => setReviewScore(prev => prev === score.value ? "" : score.value)}
                  label={score.label}
                  sublabel={score.sublabel}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Property rating" value="stars" icon={Star}>
            <div className="space-y-1">
              {STAR_RATINGS.map((star) => (
                <label key={star} className="flex items-center gap-3 cursor-pointer group py-1.5">
                  <Checkbox
                    id={`star-${star}`}
                    checked={selectedStars.includes(star)}
                    onCheckedChange={(checked) =>
                      setSelectedStars(prev => checked ? [...prev, star] : prev.filter(s => s !== star))
                    }
                    className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#004BD7] rounded"
                  />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{star} stars</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Facilities" value="facilities" icon={Building2}>
            <div className="space-y-1">
              {visibleFacilities.map((facility) => (
                <FilterCheckbox
                  key={facility.value}
                  id={`facility-${facility.value}`}
                  checked={selectedFacilities.includes(facility.value)}
                  onCheckedChange={() => toggleList(setSelectedFacilities, facility.value)}
                  label={facility.label}
                />
              ))}
            </div>
            {FACILITIES.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllFacilities(!showAllFacilities)}
                className="mt-3 text-xs text-[#004BD7] font-bold hover:underline"
              >
                {showAllFacilities ? "Show less" : `Show all ${FACILITIES.length}`}
              </button>
            )}
          </FilterSection>

          <FilterSection title="Property Highlights" value="highlights" icon={MapPin}>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: "Luxury", label: "Luxury" },
                { id: "Budget", label: "Budget" },
                { id: "Beachfront", label: "Beachfront" },
                { id: "City", label: "City" },
                { id: "Family", label: "Family" },
                { id: "Boutique", label: "Boutique" },
                { id: "Resort", label: "Resort" }
              ].map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleList(setSelectedTags, tag.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                    selectedTags.includes(tag.id)
                      ? "bg-[#004BD7] border-[#004BD7] text-white shadow-md shadow-blue-200"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Hotel types" value="hotelTypes" icon={Building2}>
            <div className="space-y-1">
              {hotelTypes?.data?.map((type: any) => (
                <FilterCheckbox
                  key={type.id}
                  id={`type-${type.id}`}
                  checked={hotelType === type.id}
                  onCheckedChange={() => setHotelType(prev => prev === type.id ? "" : type.id)}
                  label={type.name}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Property class" value="propertyClass" icon={Building2}>
            <div className="space-y-1">
              {propertyClasses?.data?.map((pc: any) => (
                <FilterCheckbox
                  key={pc.id}
                  id={`pc-${pc.id}`}
                  checked={propertyClass === pc.id}
                  onCheckedChange={() => setPropertyClass(prev => prev === pc.id ? "" : pc.id)}
                  label={pc.name}
                />
              ))}
            </div>
          </FilterSection>
          </form>
        </Accordion>
      </div>
    </div>
  );
}
