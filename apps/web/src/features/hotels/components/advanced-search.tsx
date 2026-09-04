"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  SearchIcon,
  BuildingIcon,
  UtensilsIcon,
  HistoryIcon,
  Loader2Icon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { useDebounce } from "@/hooks/use-debounce";
import { getClient } from "@/lib/rpc/client";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Sri Lanka: districts + popular cities — shown instantly on focus
 * ───────────────────────────────────────────────────────────────────────────*/
const SL_QUICK_PICKS: { name: string; subtitle: string; type: "district" | "city" }[] = [
  { name: "Colombo",        subtitle: "Western Province · Commercial capital",   type: "city"     },
  { name: "Kandy",          subtitle: "Central Province · Hill capital",          type: "city"     },
  { name: "Galle",          subtitle: "Southern Province · Historic fort city",   type: "city"     },
  { name: "Negombo",        subtitle: "Western Province · Beach & surf",          type: "city"     },
  { name: "Sigiriya",       subtitle: "Central Province · Rock fortress",         type: "city"     },
  { name: "Ella",           subtitle: "Uva Province · Scenic hill village",       type: "city"     },
  { name: "Mirissa",        subtitle: "Southern Province · Whale watching beach", type: "city"     },
  { name: "Nuwara Eliya",   subtitle: "Central Province · Tea country",           type: "city"     },
  { name: "Trincomalee",    subtitle: "Eastern Province · Pristine beaches",      type: "city"     },
  { name: "Unawatuna",      subtitle: "Southern Province · Bay beach resort",     type: "city"     },
  { name: "Bentota",        subtitle: "Southern Province · River & sea resort",   type: "city"     },
  { name: "Dambulla",       subtitle: "North Central Province · Cave temples",    type: "city"     },
  { name: "Hambantota",     subtitle: "Southern Province · Safari gateway",       type: "city"     },
  { name: "Hikkaduwa",      subtitle: "Southern Province · Coral reef beach",     type: "city"     },
  { name: "Jaffna",         subtitle: "Northern Province · Cultural heritage",    type: "city"     },
  { name: "Batticaloa",     subtitle: "Eastern Province · Lagoon city",           type: "city"     },
  { name: "Anuradhapura",   subtitle: "North Central Province · Ancient kingdom", type: "district" },
  { name: "Polonnaruwa",    subtitle: "North Central Province · Ruins & wildlife",type: "district" },
  { name: "Matara",         subtitle: "Southern Province · Southern coast",       type: "district" },
  { name: "Ratnapura",      subtitle: "Sabaragamuwa Province · Gem capital",      type: "district" },
];

/* ─────────────────────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────────────────────*/
interface Suggestion {
  id: string;
  name: string;
  subtitle: string;
  type: "district" | "city" | "destination" | "hotel" | "restaurant" | "google_place";
}

interface SearchComponentProps {
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
  compact?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  Helpers
 * ───────────────────────────────────────────────────────────────────────────*/
function formatNights(from: Date, to: Date) {
  const n = differenceInCalendarDays(to, from);
  return n === 1 ? "1 night" : `${n} nights`;
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  Component
 * ───────────────────────────────────────────────────────────────────────────*/
const SearchComponent = ({
  initialDestination = "",
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
  initialRooms = 1,
  compact = false,
}: SearchComponentProps) => {
  const router = useRouter();

  // ── Destination ──
  const [destination, setDestination] = useState(initialDestination);
  const [destOpen, setDestOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const destInputRef = useRef<HTMLInputElement>(null);
  const debouncedDestination = useDebounce(destination, 300);

  // ── Dates ──
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialCheckIn ? new Date(initialCheckIn) : undefined,
    to: initialCheckOut ? new Date(initialCheckOut) : undefined,
  });
  const [calOpen, setCalOpen] = useState(false);
  // "picking" phase: "from" = waiting for check-in click, "to" = waiting for check-out click
  const [calPhase, setCalPhase] = useState<"from" | "to">("from");
  const [mounted, setMounted] = React.useState(false);
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ── Guests & Rooms ──
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState(initialRooms);
  const [guestOpen, setGuestOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Hydration ──
  useEffect(() => { setMounted(true); }, []);

  // ── Recent searches ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  const saveToRecent = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // ── Suggestion list logic ──
  // Filtered quick picks shown immediately (no wait)
  const filteredQuickPicks: Suggestion[] = destination.length < 2
    ? SL_QUICK_PICKS.slice(0, 8).map((p) => ({ id: `qp-${p.name}`, ...p }))
    : SL_QUICK_PICKS
        .filter((p) => p.name.toLowerCase().includes(destination.toLowerCase()))
        .slice(0, 5)
        .map((p) => ({ id: `qp-${p.name}`, ...p }));

  // DB / Google suggestions fetched after debounce
  useEffect(() => {
    if (debouncedDestination.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoadingSuggestions(true);
      try {
        const client = await getClient();
        const [destRes, hotelRes, restRes, googleRes] = await Promise.allSettled([
          client.api.destination.$get({ query: { search: debouncedDestination, limit: "3" } }),
          client.api.hotels.$get({ query: { search: debouncedDestination, limit: "3" } }),
          client.api.restaurant.$get({ query: { search: debouncedDestination, limit: "3" } }),
          fetch(`/api/address/autocomplete?input=${encodeURIComponent(debouncedDestination)}`),
        ]);

        if (cancelled) return;

        const combined: Suggestion[] = [];

        if (destRes.status === "fulfilled" && destRes.value.ok) {
          const j = await destRes.value.json() as any;
          (j.data || []).forEach((d: any) =>
            combined.push({ id: d.id, name: d.title || d.name || "", subtitle: "Sri Lanka destination", type: "destination" })
          );
        }
        if (hotelRes.status === "fulfilled" && hotelRes.value.ok) {
          const j = await hotelRes.value.json() as any;
          (j.data || []).forEach((h: any) =>
            combined.push({ id: h.id, name: h.name || "", subtitle: `Hotel · ${h.city || "Sri Lanka"}`, type: "hotel" })
          );
        }
        if (restRes.status === "fulfilled" && restRes.value.ok) {
          const j = await restRes.value.json() as any;
          (j.data || []).forEach((r: any) =>
            combined.push({ id: r.id, name: r.name || "", subtitle: `Restaurant · ${r.city || "Sri Lanka"}`, type: "restaurant" })
          );
        }
        if (googleRes.status === "fulfilled" && googleRes.value.ok) {
          const j = await googleRes.value.json() as any;
          (j.data || []).slice(0, 3).forEach((p: any, i: number) =>
            combined.push({
              id: `gp-${i}`,
              name: p.placePrediction?.text?.text || "",
              subtitle: "Google Maps",
              type: "google_place",
            })
          );
        }

        if (!cancelled) setSuggestions(combined);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setIsLoadingSuggestions(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedDestination]);

  // ── Pick suggestion ──
  const pickSuggestion = (name: string) => {
    setDestination(name);
    saveToRecent(name);
    setDestOpen(false);
    // Auto-open date picker
    setTimeout(() => {
      setCalPhase("from");
      setCalOpen(true);
    }, 80);
  };

  // ── Date picker logic ──
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) return;

    if (calPhase === "from") {
      // User just picked check-in — clear checkout and move to "to" phase
      setDateRange({ from: range.from, to: undefined });
      if (range.from) setCalPhase("to");
    } else {
      // User is picking check-out
      if (range.to) {
        setDateRange(range);
        // Done — close calendar & open guests
        setTimeout(() => {
          setCalOpen(false);
          setGuestOpen(true);
        }, 120);
      } else {
        setDateRange(range);
      }
    }
  };

  // Label helpers
  const checkInLabel = mounted && dateRange?.from ? format(dateRange.from, "EEE, d MMM") : "Add date";
  const checkOutLabel = mounted && dateRange?.to ? format(dateRange.to, "EEE, d MMM") : "Add date";
  const nightsLabel = mounted && dateRange?.from && dateRange?.to
    ? formatNights(dateRange.from, dateRange.to)
    : null;

  // ── Guests label ──
  const guestLabel = `${guests} guest${guests > 1 ? "s" : ""} · ${rooms} room${rooms > 1 ? "s" : ""}`;

  // ── Search ──
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      destInputRef.current?.focus();
      setDestOpen(true);
      return;
    }
    const query = new URLSearchParams({
      search: destination.trim(),
      checkIn: dateRange?.from ? dateRange.from.toISOString() : "",
      checkOut: dateRange?.to ? dateRange.to.toISOString() : "",
      guests: guests.toString(),
      rooms: rooms.toString(),
    }).toString();
    router.push(`/search?${query}`, { scroll: false });
  };

  // ── Dropdown content ──
  const showRecent = destination.length === 0 && recentSearches.length > 0;
  const showQuickPicks = filteredQuickPicks.length > 0;
  const showDbResults = suggestions.length > 0;

  const SuggestionRow = ({ item, onClick }: { item: Suggestion; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-blue-50 group transition-colors text-left"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        {(item.type === "city" || item.type === "district" || item.type === "destination" || item.type === "google_place") && (
          <MapPinIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
        )}
        {item.type === "hotel" && <BuildingIcon className="w-4 h-4 text-emerald-500" />}
        {item.type === "restaurant" && <UtensilsIcon className="w-4 h-4 text-orange-500" />}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 truncate">{item.name}</p>
        <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
      </div>
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

        .search-bar {
          background: ${compact ? "white" : "rgba(255,255,255,0.65)"};
          backdrop-filter: ${compact ? "none" : "blur(12px)"};
          display: flex;
          align-items: stretch;
          width: 100%;
          border-radius: ${compact ? "12px" : "20px"};
          overflow: visible;
          border: ${compact ? "none" : "1px solid rgba(255,255,255,0.4)"};
        }

        .field-pill {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: ${compact ? "6px 14px" : "8px 20px"};
          cursor: pointer;
          transition: background 0.15s ease;
          min-width: 0;
          flex: 1;
          border-radius: ${compact ? "10px" : "16px"};
          text-align: left;
        }

        .field-pill:hover, .field-pill.active {
          background: ${compact ? "#F9FAFB" : "rgba(255,255,255,0.35)"};
        }

        .field-pill.destination { flex: 1.6; }
        .field-pill.dates { flex: 1.4; }

        .field-divider {
          width: 1px;
          background: ${compact ? "#E5E7EB" : "rgba(0,0,0,0.12)"};
          margin: ${compact ? "10px 0" : "10px 0"};
          flex-shrink: 0;
          align-self: stretch;
        }

        .field-label {
          font-size: ${compact ? "9px" : "10px"};
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${compact ? "#9CA3AF" : "rgba(30,30,30,0.6)"};
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .field-label svg { width: 11px; height: 11px; }

        .field-value {
          font-size: ${compact ? "13px" : "14px"};
          font-weight: 700;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .field-value.placeholder { color: #9CA3AF; font-weight: 500; }

        .field-value input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          font-size: ${compact ? "13px" : "14px"};
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }

        .field-value input::placeholder { color: #9CA3AF; font-weight: 500; }

        .nights-badge {
          font-size: 10px;
          color: #003580;
          background: #EFF6FF;
          border-radius: 4px;
          padding: 1px 5px;
          font-weight: 700;
          margin-left: 4px;
          display: inline-block;
        }

        .search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: ${compact ? "0 20px" : "0 28px"};
          background: #003580;
          color: #fff;
          border: none;
          font-size: ${compact ? "14px" : "15px"};
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
          border-radius: ${compact ? "8px" : "14px"};
          flex-shrink: 0;
          margin: ${compact ? "4px" : "6px"};
          box-shadow: ${compact ? "none" : "0 6px 18px rgba(0,53,128,0.28)"};
        }

        .search-btn:hover {
          background: #0045a1;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,53,128,0.35);
        }

        .search-btn:active { transform: translateY(0); }
        .search-btn svg { width: 17px; height: 17px; }

        .sugg-panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.14);
          overflow: hidden;
          z-index: 999;
        }

        .sugg-section-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9CA3AF;
          padding: 10px 12px 4px;
        }

        .guest-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f2f2f2;
        }
        .guest-row:last-of-type { border-bottom: none; }
        .guest-title { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .guest-sub { font-size: 11px; color: #6a6a6a; margin-top: 1px; }
        .counter-group { display: flex; align-items: center; gap: 12px; }
        .counter-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid #003580;
          background: #fff;
          color: #003580;
          font-size: 18px;
          line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .counter-btn:hover:not(:disabled) { background: #EFF6FF; }
        .counter-btn:disabled { opacity: 0.25; cursor: not-allowed; border-color: #ccc; color: #ccc; }
        .counter-val { font-size: 15px; font-weight: 700; color: #1a1a1a; width: 22px; text-align: center; }

        /* Calendar overrides */
        [data-radix-popper-content-wrapper] .rdp-day_selected,
        [data-radix-popper-content-wrapper] .rdp-day_selected:hover {
          background: #003580 !important;
          color: white !important;
          font-weight: 700;
        }
        [data-radix-popper-content-wrapper] .rdp-day_range_middle {
          background: #dbeafe !important;
          color: #003580 !important;
          border-radius: 0 !important;
        }
        [data-radix-popper-content-wrapper] .rdp-day_range_start,
        [data-radix-popper-content-wrapper] .rdp-day_range_end {
          background: #003580 !important;
          color: white !important;
        }
        [data-radix-popper-content-wrapper] .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background: #EFF6FF;
          color: #003580;
        }
        [data-radix-popper-content-wrapper] .rdp-caption_label {
          color: #1a1a1a;
          font-weight: 700;
          font-size: 14px;
        }
        [data-radix-popper-content-wrapper] .rdp-day_disabled { opacity: 0.25; }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Compact state */
          .search-bar.mobile-collapsed {
            flex-direction: row;
            align-items: center;
            padding: 8px 12px;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border: 1px solid #E5E7EB;
            cursor: pointer;
            height: 56px;
          }

          .mobile-collapsed .compact-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            padding-left: 8px;
          }

          .mobile-collapsed .compact-title {
             font-size: 14px;
             font-weight: 700;
             color: #1a1a1a;
             line-height: 1.2;
          }

          .mobile-collapsed .compact-meta {
             font-size: 11px;
             color: #6B7280;
             line-height: 1.2;
             margin-top: 2px;
          }

          .mobile-collapsed .search-btn-icon {
             width: 40px;
             height: 40px;
             background: #003580;
             color: white;
             border-radius: 10px;
             display: flex;
             align-items: center;
             justify-content: center;
             flex-shrink: 0;
          }

          /* Hide full fields in collapsed state */
          .mobile-collapsed .field-pill,
          .mobile-collapsed .field-divider,
          .mobile-collapsed .search-btn {
            display: none;
          }

          /* Expanded state */
          .field-divider { display: none; }
          .field-pill { border-bottom: 1px solid #f2f2f2; border-radius: 0; }
          .field-pill:last-of-type { border-bottom: none; }
          .search-btn { height: 50px; border-radius: 10px; margin: 6px; }

          .close-expanded {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #F3F4F6;
            background: #F9FAFB;
          }
          .close-expanded span {
            font-size: 14px;
            font-weight: 700;
            color: #1a1a1a;
          }
          .close-btn {
            paddding: 4px;
            color: #4B5563;
          }
        }

        @media (min-width: 769px) {
          .compact-info, .close-expanded, .search-btn-icon { display: none !important; }
        }
      `}</style>

      <div className="w-full">
        <form onSubmit={handleSearch}>
          <div 
            className={cn(
              "search-bar", 
              !isExpanded && "mobile-collapsed"
            )}
            onClick={() => {
              if (!isExpanded) {
                setIsExpanded(true);
                // On mobile, auto-focus destination when expanding
                setTimeout(() => destInputRef.current?.focus(), 250);
              }
            }}
          >
            {/* Mobile Collapsed View */}
            {!isExpanded && (
              <>
                <div className="search-btn-icon">
                  <SearchIcon size={20} />
                </div>
                <div className="compact-info">
                  <div className="compact-title truncate">
                    {destination || "Where are you going?"}
                  </div>
                  <div className="compact-meta truncate">
                    {mounted && dateRange?.from ? format(dateRange.from, "MMM d") : "Anytime"}
                    {" • "}
                    {guestLabel}
                  </div>
                </div>
              </>
            )}

            {/* Mobile Expanded Header */}
            {isExpanded && (
              <div className="close-expanded md:hidden">
                <span>Update Search</span>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                >
                  <XIcon size={20} />
                </button>
              </div>
            )}

            {/* ─── Destination ─── */}
            <Popover open={destOpen} onOpenChange={setDestOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn("field-pill destination", destOpen && "active")}
                  onClick={() => {
                    setDestOpen(true);
                    setTimeout(() => destInputRef.current?.focus(), 10);
                  }}
                >
                  <div className="field-label"><MapPinIcon /> Where to</div>
                  <div className="field-value">
                    <input
                      ref={destInputRef}
                      type="text"
                      placeholder="Search destinations..."
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        if (!destOpen) setDestOpen(true);
                      }}
                      onFocus={() => setDestOpen(true)}
                      autoComplete="off"
                    />
                    {destination.length > 0 && (
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); setDestination(""); setSuggestions([]); }}
                        className="ml-1 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
                      >
                        <XCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-2 sugg-panel border-none w-[400px]"
                align="start"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {/* Recent searches */}
                {showRecent && (
                  <div>
                    <p className="sugg-section-label">Recent searches</p>
                    {recentSearches.map((s) => (
                      <SuggestionRow
                        key={s}
                        item={{ id: s, name: s, subtitle: "Recent", type: "city" }}
                        onClick={() => pickSuggestion(s)}
                      />
                    ))}
                    <div className="h-px bg-gray-100 my-2" />
                  </div>
                )}

                {/* Quick pick places — shown instantly */}
                {showQuickPicks && (
                  <div>
                    <p className="sugg-section-label">
                      {destination.length < 2 ? "Popular in Sri Lanka" : "Matching destinations"}
                    </p>
                    {filteredQuickPicks.map((p) => (
                      <SuggestionRow
                        key={p.id}
                        item={p}
                        onClick={() => pickSuggestion(p.name)}
                      />
                    ))}
                  </div>
                )}

                {/* DB/Google results — appear below quick picks once loaded */}
                {isLoadingSuggestions && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                    <Loader2Icon className="w-3.5 h-3.5 animate-spin" /> Searching…
                  </div>
                )}
                {!isLoadingSuggestions && showDbResults && (
                  <div>
                    <div className="h-px bg-gray-100 my-2" />
                    <p className="sugg-section-label">From our listings</p>
                    {suggestions.map((s) => (
                      <SuggestionRow key={s.id} item={s} onClick={() => pickSuggestion(s.name)} />
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!isLoadingSuggestions && destination.length >= 2 && filteredQuickPicks.length === 0 && suggestions.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No results found. Try another city.</p>
                )}
              </PopoverContent>
            </Popover>

            <div className="field-divider" />

            {/* ─── Dates — single popover, two-phase picking (Booking.com style) ─── */}
            <Popover open={calOpen} onOpenChange={(open) => {
              setCalOpen(open);
              if (open) setCalPhase(dateRange?.from ? "to" : "from");
            }}>
              <PopoverTrigger asChild>
                <div
                  className={cn("field-pill dates", calOpen && calPhase === "from" && "active")}
                  onClick={() => {
                    setCalPhase("from");
                    setCalOpen(true);
                  }}
                >
                  <div className="field-label"><CalendarIcon /> Check-in</div>
                  <div className={cn("field-value", !dateRange?.from && "placeholder")}>
                    {checkInLabel}
                  </div>
                </div>
              </PopoverTrigger>
              {/* Check-out trigger shares the same popover */}
              <PopoverContent
                className="w-auto p-0 sugg-panel border-none"
                align="start"
                sideOffset={8}
              >
                {/* Phase label */}
                <div className="flex items-center gap-4 px-4 pt-3 pb-1 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCalPhase("from")}
                    className={cn(
                      "text-xs font-bold pb-1 border-b-2 transition-colors",
                      calPhase === "from" ? "border-[#003580] text-[#003580]" : "border-transparent text-gray-400"
                    )}
                  >
                    Check-in · <span className={cn(dateRange?.from ? "text-gray-700" : "text-gray-400")}>{checkInLabel}</span>
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    type="button"
                    onClick={() => setCalPhase("to")}
                    className={cn(
                      "text-xs font-bold pb-1 border-b-2 transition-colors",
                      calPhase === "to" ? "border-[#003580] text-[#003580]" : "border-transparent text-gray-400"
                    )}
                  >
                    Check-out · <span className={cn(dateRange?.to ? "text-gray-700" : "text-gray-400")}>{checkOutLabel}</span>
                  </button>
                  {nightsLabel && (
                    <span className="nights-badge ml-auto">{nightsLabel}</span>
                  )}
                </div>
                <div className="p-2 text-xs text-center text-gray-400 font-medium py-1.5">
                  {calPhase === "from" ? "Select your check-in date" : "Select your check-out date"}
                </div>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={mounted ? (date: Date) => {
                    const d = new Date(date); d.setHours(0,0,0,0);
                    if (d < today) return true;
                    if (calPhase === "to" && dateRange?.from) {
                      return d <= dateRange.from;
                    }
                    return false;
                  } : undefined}
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from ?? today}
                  modifiersClassNames={{
                    selected: "rdp-day_selected",
                    range_middle: "rdp-day_range_middle",
                    range_start: "rdp-day_range_start",
                    range_end: "rdp-day_range_end",
                  }}
                />
                {/* Quick duration shortcuts */}
                {calPhase === "to" && dateRange?.from && (
                  <div className="flex gap-2 px-4 pb-3 pt-1 border-t border-gray-100 flex-wrap">
                    {[1, 2, 3, 5, 7, 14].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          const to = addDays(dateRange.from!, n);
                          setDateRange({ from: dateRange.from, to });
                          setTimeout(() => { setCalOpen(false); setGuestOpen(true); }, 100);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-colors"
                      >
                        {n} night{n > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <div className="field-divider" />

            {/* ─── Check-out trigger (visual only — shares popover above) ─── */}
            <div
              className={cn("field-pill dates", calOpen && calPhase === "to" && "active")}
              onClick={() => {
                setCalPhase("to");
                setCalOpen(true);
              }}
            >
              <div className="field-label"><CalendarIcon /> Check-out</div>
              <div className={cn("field-value", !dateRange?.to && "placeholder")}>
                {checkOutLabel}
              </div>
            </div>

            <div className="field-divider" />

            {/* ─── Guests & Rooms ─── */}
            <Popover open={guestOpen} onOpenChange={setGuestOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn("field-pill", guestOpen && "active")}
                  onClick={() => setGuestOpen(true)}
                >
                  <div className="field-label"><UsersIcon /> Guests & Rooms</div>
                  <div className="field-value">{guestLabel}</div>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="sugg-panel p-5 min-w-[300px] border-none">
                <p className="text-sm font-bold text-gray-900 mb-3">Who's coming?</p>
                {[
                  { title: "Adults", sub: "Age 13+", val: guests, set: setGuests, min: 1, max: 20 },
                  { title: "Rooms", sub: "How many rooms?", val: rooms, set: setRooms, min: 1, max: 10 },
                ].map(({ title, sub, val, set, min, max }) => (
                  <div className="guest-row" key={title}>
                    <div>
                      <div className="guest-title">{title}</div>
                      <div className="guest-sub">{sub}</div>
                    </div>
                    <div className="counter-group">
                      <button type="button" className="counter-btn" onClick={() => set(Math.max(min, val - 1))} disabled={val <= min}>−</button>
                      <span className="counter-val">{val}</span>
                      <button type="button" className="counter-btn" onClick={() => set(Math.min(max, val + 1))} disabled={val >= max}>+</button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGuestOpen(false)}
                  className="mt-3 w-full py-2 rounded-lg bg-[#003580] text-white text-sm font-bold hover:bg-[#0045a1] transition-colors"
                >
                  Done
                </button>
              </PopoverContent>
            </Popover>

            {/* ─── Search button ─── */}
            <button type="submit" className="search-btn">
              <SearchIcon />
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchComponent;