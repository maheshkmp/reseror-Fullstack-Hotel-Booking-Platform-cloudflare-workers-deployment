import { 
  ShieldCheck, 
  Flame, 
  Cctv, 
  Bell, 
  Stethoscope, 
  XCircle, 
  AlertTriangle,
  DoorOpen,
  Eye,
  HandHelping,
  Activity
} from "lucide-react";

export interface SafetyFeatureItem {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export const safetyFeaturesList: SafetyFeatureItem[] = [
  { id: "smoke_alarm", name: "Smoke Alarms", icon: Flame, description: "Advanced detectors on every floor" },
  { id: "fire_extinguisher", name: "Fire Extinguishers", icon: Flame, description: "Equipped at strategic locations" },
  { id: "cctv", name: "CCTV in Public Areas", icon: Cctv, description: "24/7 video monitoring" },
  { id: "24_hr_security", name: "24-Hour Security", icon: ShieldCheck, description: "Manned security desk" },
  { id: "first_aid_kit", name: "First Aid Kit", icon: Stethoscope, description: "Medical supplies readily available" },
  { id: "emergency_exit", name: "Emergency Exits", icon: DoorOpen, description: "Clearly marked escape routes" },
  { id: "co_alarm", name: "Carbon Monoxide Alarm", icon: AlertTriangle, description: "Testing for harmful gases" },
  { id: "security_alarm", name: "Security Alarm", icon: Bell, description: "Property-wide protection system" },
  { id: "concierge_security", name: "Safe Concierge", icon: HandHelping, description: "Staff trained in emergency response" },
  { id: "exterior_lighting", name: "Well-lit Entrances", icon: Eye, description: "Enhanced safety at night" },
  { id: "health_checks", name: "Daily Health Monitoring", icon: Activity, description: "Optional staff monitoring" },
];
