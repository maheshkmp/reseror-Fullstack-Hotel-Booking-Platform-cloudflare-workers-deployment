import {
  FaBaby,
  FaBan,
  FaBath,
  FaBicycle,
  FaBreadSlice,
  FaBriefcase,
  FaBroom,
  FaCar,
  FaChargingStation,
  FaClock,
  FaCocktail,
  FaCoffee,
  FaConciergeBell,
  FaCouch,
  FaDumbbell,
  FaGamepad,
  FaGlassMartini,
  FaHotTub,
  FaLock,
  FaParking,
  FaPaw,
  FaShuttleVan,
  FaSmoking,
  FaSnowflake,
  FaSortUp,
  FaSpa,
  FaSwimmingPool,
  FaTshirt,
  FaTv,
  FaUmbrellaBeach,
  FaUsers,
  FaUtensils,
  FaWheelchair,
  FaFire,
  FaTree,
  FaShieldAlt,
  FaBolt,
  FaWifi,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

export type AmenitiesListItem = {
  id: number;
  name: string;
  icon: IconType;
};

export const amenitiesList: AmenitiesListItem[] = [
  // Essentials
  { id: 1, name: "Free WiFi", icon: FaWifi },
  { id: 2, name: "Air Conditioning", icon: FaSnowflake },
  { id: 3, name: "Heating", icon: FaFire },
  { id: 4, name: "Elevator", icon: FaSortUp },
  { id: 5, name: "Non-smoking Rooms", icon: FaBan },
  { id: 6, name: "Safe", icon: FaLock },
  { id: 7, name: "Accessible", icon: FaWheelchair },
  { id: 8, name: "Security", icon: FaShieldAlt },
  { id: 9, name: "Backup Generator", icon: FaBolt },

  // Wellness & Activities
  { id: 10, name: "Swimming Pool", icon: FaSwimmingPool },
  { id: 11, name: "Fitness Center", icon: FaDumbbell },
  { id: 12, name: "Spa & Wellness", icon: FaSpa },
  { id: 13, name: "Hot Tub", icon: FaHotTub },
  { id: 14, name: "Beachfront", icon: FaUmbrellaBeach },
  { id: 15, name: "Garden", icon: FaTree },

  // Food & Drink
  { id: 20, name: "Restaurant", icon: FaUtensils },
  { id: 21, name: "Bar", icon: FaCocktail },
  { id: 22, name: "Breakfast", icon: FaBreadSlice },
  { id: 23, name: "Coffee Maker", icon: FaCoffee },
  { id: 24, name: "Mini Bar", icon: FaGlassMartini },

  // Services
  { id: 30, name: "24-Hour Front Desk", icon: FaClock },
  { id: 31, name: "Room Service", icon: FaConciergeBell },
  { id: 32, name: "Laundry Service", icon: FaTshirt },
  { id: 33, name: "Daily Housekeeping", icon: FaBroom },
  { id: 34, name: "Airport Shuttle", icon: FaShuttleVan },
  { id: 35, name: "Concierge Service", icon: FaConciergeBell },
  { id: 36, name: "Business Center", icon: FaBriefcase },

  // Transport
  { id: 40, name: "Free Parking", icon: FaParking },
  { id: 41, name: "EV Charging Station", icon: FaChargingStation },
  { id: 42, name: "Car Hire", icon: FaCar },
  { id: 43, name: "Bicycle Rental", icon: FaBicycle },

  // Family & Entertainment
  { id: 50, name: "Family Rooms", icon: FaUsers },
  { id: 51, name: "Babysitting", icon: FaBaby },
  { id: 52, name: "Kids' Club", icon: FaGamepad },
  { id: 53, name: "Flat-screen TV", icon: FaTv },
  { id: 54, name: "Pets Allowed", icon: FaPaw },
  { id: 55, name: "Smoking Area", icon: FaSmoking }
];

