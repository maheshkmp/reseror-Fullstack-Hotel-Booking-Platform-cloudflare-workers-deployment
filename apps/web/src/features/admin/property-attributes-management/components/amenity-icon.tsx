/**
 * Resolves a react-icons/fa icon name string (e.g. "FaWifi") to a renderable
 * React element of a fixed size. Falls back to <Sparkles> if not found.
 */
import {
  FaBaby, FaBan, FaBath, FaBicycle, FaBreadSlice, FaBriefcase, FaBroom,
  FaCar, FaChargingStation, FaClock, FaCocktail, FaCoffee, FaConciergeBell,
  FaCouch, FaDumbbell, FaGamepad, FaGlassMartini, FaHotTub, FaLock,
  FaParking, FaPaw, FaShuttleVan, FaSmoking, FaSnowflake, FaSortUp, FaSpa,
  FaSwimmingPool, FaTshirt, FaTv, FaUmbrellaBeach, FaUsers, FaUtensils,
  FaWheelchair, FaFire, FaTree, FaShieldAlt, FaBolt, FaWifi,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import type { IconType } from "react-icons/lib";

const ICON_MAP: Record<string, IconType> = {
  FaBaby, FaBan, FaBath, FaBicycle, FaBreadSlice, FaBriefcase, FaBroom,
  FaCar, FaChargingStation, FaClock, FaCocktail, FaCoffee, FaConciergeBell,
  FaCouch, FaDumbbell, FaGamepad, FaGlassMartini, FaHotTub, FaLock,
  FaParking, FaPaw, FaShuttleVan, FaSmoking, FaSnowflake, FaSortUp, FaSpa,
  FaSwimmingPool, FaTshirt, FaTv, FaUmbrellaBeach, FaUsers, FaUtensils,
  FaWheelchair, FaFire, FaTree, FaShieldAlt, FaBolt, FaWifi,
};

interface AmenityIconProps {
  icon?: string | null;
  /** Tailwind size class, e.g. "size-5". Defaults to "size-5". */
  className?: string;
}

export function AmenityIcon({ icon, className = "size-5" }: AmenityIconProps) {
  if (icon && ICON_MAP[icon]) {
    const Icon = ICON_MAP[icon];
    return <Icon className={className} />;
  }
  return <Sparkles className={className} />;
}
