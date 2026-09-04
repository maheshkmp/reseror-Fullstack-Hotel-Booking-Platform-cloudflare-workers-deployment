import {
  UtensilsCrossed,
  Sofa,
  Trees,
  Tv,
  Coffee,
  Microwave,
  Refrigerator,
  Wifi,
  Waves,
  Gamepad2,
  Library,
  Flame,
} from "lucide-react";

export const commonAreaFeatures = [
  { id: "shared_kitchen", label: "Shared Kitchen", icon: UtensilsCrossed },
  { id: "shared_lounge", label: "Shared Lounge / TV Area", icon: Sofa },
  { id: "terrace", label: "Terrace", icon: Trees },
  { id: "garden", label: "Garden", icon: Trees },
  { id: "picnic_area", label: "Picnic Area", icon: Trees },
  { id: "outdoor_fireplace", label: "Outdoor Fireplace", icon: Flame },
  { id: "games_room", label: "Games Room", icon: Gamepad2 },
  { id: "library", label: "Library", icon: Library },
  { id: "sun_deck", label: "Sun Deck", icon: Waves },
  { id: "shared_dining_area", label: "Shared Dining Area", icon: Coffee },
];

export const getCommonAreaLabel = (id: string) =>
  commonAreaFeatures.find((f) => f.id === id)?.label || id;
