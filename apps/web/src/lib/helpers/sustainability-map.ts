import {
  Leaf,
  Droplets,
  Wind,
  Trash2,
  Zap,
  ShoppingBag,
  Utensils,
  Lightbulb,
  Globe,
  Waves,
} from "lucide-react";

export const sustainabilityInitiatives = [
  { id: "no_single_use_plastics", label: "No Single-use Plastics", icon: Trash2 },
  { id: "water_efficient_toilets", label: "Water-efficient Toilets", icon: Droplets },
  { id: "renewable_energy", label: "100% Renewable Energy", icon: Wind },
  { id: "led_lighting", label: "Energy-efficient LED Bulbs", icon: Lightbulb },
  { id: "ev_charging", label: "EV Charging Station", icon: Zap },
  { id: "local_food", label: "Locally Sourced Food", icon: Utensils },
  { id: "waste_recycling", label: "Waste Recycling Program", icon: Trash2 },
  { id: "towel_reuse_program", label: "Towel Reuse Program", icon: Leaf },
  { id: "green_spaces", label: "Gardens & Green Spaces", icon: Globe },
  { id: "water_conservation", label: "Water Conservation Practices", icon: Droplets },
  { id: "organic_toiletries", label: "Organic / Natural Toiletries", icon: ShoppingBag },
  { id: "composting", label: "On-site Composting", icon: Leaf },
];

export const getSustainabilityLabel = (id: string) =>
  sustainabilityInitiatives.find((i) => i.id === id)?.label || id;
