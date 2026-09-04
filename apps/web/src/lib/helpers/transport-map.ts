import {
  Car,
  ParkingCircle,
  Bus,
  Plane,
  Bike,
  Zap,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
} from "lucide-react";

export const transportParkingFeatures = [
  { id: "free_onsite_parking", label: "Free On-site Parking", icon: ParkingCircle },
  { id: "paid_onsite_parking", label: "Paid On-site Parking", icon: CreditCard },
  { id: "private_parking", label: "Private Parking", icon: ShieldCheck },
  { id: "valet_parking", label: "Valet Parking", icon: Car },
  { id: "ev_charging", label: "Electric Vehicle Charging", icon: Zap },
  { id: "reservation_parking", label: "Parking Reservation Required", icon: Clock },
  { id: "airport_shuttle_free", label: "Free Airport Shuttle", icon: Plane },
  { id: "airport_shuttle_paid", label: "Paid Airport Shuttle", icon: Plane },
  { id: "local_shuttle_free", label: "Free Local Shuttle", icon: Bus },
  { id: "bike_rental", label: "Bicycle Rental", icon: Bike },
  { id: "car_rental", label: "Car Rental Service", icon: Car },
  { id: "offsite_parking", label: "Off-site Parking Nearby", icon: MapPin },
];

export const getTransportLabel = (id: string) =>
  transportParkingFeatures.find((f) => f.id === id)?.label || id;
