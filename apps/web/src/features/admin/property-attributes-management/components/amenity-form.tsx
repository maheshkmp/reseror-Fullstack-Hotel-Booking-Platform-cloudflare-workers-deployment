"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { useCreateAmenity } from "../api/use-create-amenity";

// Common icons admins can assign (icon string = display name)
const ICON_OPTIONS = [
  "FaWifi", "FaSnowflake", "FaFire", "FaSortUp", "FaBan", "FaLock",
  "FaWheelchair", "FaShieldAlt", "FaBolt", "FaSwimmingPool", "FaDumbbell",
  "FaSpa", "FaHotTub", "FaUmbrellaBeach", "FaTree", "FaUtensils",
  "FaCocktail", "FaBreadSlice", "FaCoffee", "FaGlassMartini", "FaClock",
  "FaConciergeBell", "FaTshirt", "FaBroom", "FaShuttleVan", "FaBriefcase",
  "FaParking", "FaChargingStation", "FaCar", "FaBicycle", "FaUsers",
  "FaBaby", "FaGamepad", "FaTv", "FaPaw", "FaSmoking", "FaBath",
];

export function AmenityForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>("");
  const { mutateAsync, isPending } = useCreateAmenity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({ name: name.trim(), icon: icon || null });
    setName("");
    setIcon("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <PlusIcon className="size-4" />
          New Amenity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Add New Amenity</DialogTitle>
            <DialogDescription>
              Create a global amenity that hotel owners can select when setting up their properties.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amenity-name">Amenity Name</Label>
              <Input
                id="amenity-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Rooftop Pool"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amenity-icon">Icon</Label>
              <select
                id="amenity-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">-- No icon --</option>
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic.replace("Fa", "").replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Icon identifiers map to react-icons (FaWifi, FaSpa, etc.)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? "Creating..." : "Create Amenity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
