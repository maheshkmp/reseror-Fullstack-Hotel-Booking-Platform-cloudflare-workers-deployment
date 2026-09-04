"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Binoculars, MapPin, Navigation, Plus, Train, Trash2, Utensils } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useAddHotelNearbyPois } from "../../queries/use-add-hotel-nearby-pois";
import { useGetHotelNearbyPois } from "../../queries/use-get-hotel-nearby-pois";
import { getClient } from "@/lib/rpc/client";
import { InsertHotelNearbyPoiType, type HotelNearbyPoi } from "core/zod";

type Props = {
  className?: string;
  hotelId?: string;
};

// Internal type for suggestions from Google
interface POISuggestion {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  primaryType: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export function ManageHotelNearbyPOIs({ className, hotelId }: Props) {
  const { data: savedPois, isLoading: isLoadingSaved, error: savedError } = useGetHotelNearbyPois(hotelId);
  const { mutateAsync, isPending: isSaving } = useAddHotelNearbyPois(hotelId);
  const { register, unregister } = useSaveRegistry();

  const [selectedPois, setSelectedPois] = useState<InsertHotelNearbyPoiType[]>([]);
  const [activeTab, setActiveTab] = useState("sights");
  
  // Manual POI form state
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [manualPoi, setManualPoi] = useState({
    name: "",
    type: "sight",
    distanceText: ""
  });
  
  // State for the hotel's coordinates to fetch suggestions
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string } | null>(null);

  // Fetch hotel coordinates first
  const { data: hotelData } = useQuery({
    queryKey: ["hotel-coords", hotelId],
    queryFn: async () => {
      const rpcClient = await getClient();
      
      if (hotelId) {
        const res = await rpcClient.api.hotels[":id"].$get({
          param: { id: hotelId },
        });
        if (!res.ok) return null;
        return await res.json();
      } else {
        const res = await rpcClient.api.hotels["my-hotel"].$get();
        if (!res.ok) return null;
        return await res.json();
      }
    }
  });

  useEffect(() => {
    if (hotelData?.latitude && hotelData?.longitude) {
      setCoordinates({ 
        lat: hotelData.latitude, 
        lng: hotelData.longitude 
      });
    }
  }, [hotelData]);

  // Fetch suggestions from our internal API route
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["nearby-poi-suggestions", coordinates],
    queryFn: async () => {
      if (!coordinates) return [];
      const res = await fetch(`/api/address/nearby-pois?lat=${coordinates.lat}&lng=${coordinates.lng}`);
      const json = await res.json();
      return json.data as POISuggestion[];
    },
    enabled: !!coordinates
  });

  useEffect(() => {
    if (savedPois && !isLoadingSaved && !savedError) {
      // API might return an array or an object with a data property
      const poisArray = Array.isArray(savedPois) 
        ? savedPois 
        : (savedPois as any).data || [];
        
      setSelectedPois(poisArray.map((p: HotelNearbyPoi) => ({
        hotelId: p.hotelId,
        name: p.name,
        type: p.type,
        distanceText: p.distanceText,
        durationText: p.durationText,
        latitude: p.latitude,
        longitude: p.longitude,
        isActive: p.isActive
      })));
    }
  }, [savedPois, isLoadingSaved, savedError]);

  const handleAddPoi = (poi: POISuggestion) => {
    if (selectedPois.some(p => p.name === poi.displayName.text)) return;

    setSelectedPois(prev => [
      ...prev,
      {
        hotelId: hotelData?.id || "",
        name: poi.displayName.text,
        type: mapGoogleTypeToInternal(poi.primaryType),
        latitude: poi.location.latitude.toString(),
        longitude: poi.location.longitude.toString(),
        isActive: true,
        distanceText: "", // Could be calculated later
        durationText: ""
      }
    ]);
  };

  const mapGoogleTypeToInternal = (googleType: string): string => {
    const sightings = ["tourist_attraction", "museum", "park", "landmark", "historical_landmark"];
    const transit = ["train_station", "bus_station", "airport", "subway_station"];
    const dining = ["restaurant", "cafe", "bar", "bakery"];

    if (sightings.includes(googleType)) return "sight";
    if (transit.includes(googleType)) return "transit";
    if (dining.includes(googleType)) return "dining";
    return "other";
  };

  const getPoiIcon = (type: string) => {
    switch (type) {
      case "sight": return <Binoculars className="w-4 h-4" />;
      case "transit": return <Train className="w-4 h-4" />;
      case "dining": return <Utensils className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  const handleManualAddPoi = () => {
    if (!manualPoi.name) return;

    setSelectedPois(prev => [
      ...prev,
      {
        hotelId: hotelData?.id || "",
        name: manualPoi.name,
        type: manualPoi.type,
        latitude: coordinates?.lat || null,
        longitude: coordinates?.lng || null,
        isActive: true,
        distanceText: manualPoi.distanceText,
        durationText: ""
      }
    ]);

    setManualPoi({ name: "", type: "sight", distanceText: "" });
    setIsManualDialogOpen(false);
  };

  const isDirty = useMemo(() => {
    if (!savedPois) return false;
    const poisArray = Array.isArray(savedPois)
      ? savedPois
      : (savedPois as any).data || [];

    const normalize = (val: any) => (val === null || val === undefined ? "" : String(val).trim());
    const normalizeCoord = (val: any) => (val === null || val === undefined || val === "" ? undefined : Number(val));

    const initial = poisArray.map((p: HotelNearbyPoi) => ({
      hotelId: normalize(p.hotelId),
      name: normalize(p.name),
      type: normalize(p.type),
      distanceText: normalize(p.distanceText),
      durationText: normalize(p.durationText),
      latitude: normalizeCoord(p.latitude),
      longitude: normalizeCoord(p.longitude),
      isActive: !!p.isActive
    }));
    
    const current = selectedPois.map(p => ({
      hotelId: normalize(p.hotelId),
      name: normalize(p.name),
      type: normalize(p.type),
      distanceText: normalize(p.distanceText),
      durationText: normalize(p.durationText),
      latitude: normalizeCoord(p.latitude),
      longitude: normalizeCoord(p.longitude),
      isActive: !!p.isActive
    }));
    
    return JSON.stringify(current) !== JSON.stringify(initial);
  }, [selectedPois, savedPois]);

  useEffect(() => {
    register({
      id: "hotel-nearby-pois",
      isDirty,
      onSave: async () => {
        await mutateAsync(selectedPois);
      },
      onReset: () => {
        if (savedPois) {
          const poisArray = Array.isArray(savedPois)
            ? savedPois
            : (savedPois as any).data || [];

          setSelectedPois(poisArray.map((p: HotelNearbyPoi) => ({
            hotelId: p.hotelId,
            name: p.name,
            type: p.type,
            distanceText: p.distanceText,
            durationText: p.durationText,
            latitude: p.latitude,
            longitude: p.longitude,
            isActive: p.isActive
          })));
        }
      },
    });
    return () => unregister("hotel-nearby-pois");
  }, [register, unregister, isDirty, selectedPois, savedPois, mutateAsync]);

  const handleRemovePoi = (index: number) => {
    setSelectedPois((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    mutateAsync(selectedPois);
  };

  const filteredSuggestions = suggestions?.filter(s => {
    const type = mapGoogleTypeToInternal(s.primaryType);
    if (activeTab === "sights") return type === "sight";
    if (activeTab === "transit") return type === "transit";
    if (activeTab === "dining") return type === "dining";
    return true;
  });

  return (
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-100 text-slate-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Nearby Points of Interest</CardTitle>
            <CardDescription className="text-xs">
              Highlight local attractions, transport hubs, and dining to help guests plan their stay.
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider">
                <Plus className="w-3 h-3 mr-1" />
                Add Custom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Custom Point of Interest</DialogTitle>
                <DialogDescription>
                  Enter the details of the local spot manually.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Grand Central Park"
                    value={manualPoi.name}
                    onChange={(e) => setManualPoi({ ...manualPoi, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-xs uppercase tracking-widest font-bold">Category</Label>
                  <Select
                    value={manualPoi.type}
                    onValueChange={(value) => setManualPoi({ ...manualPoi, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sight">Sight / Attraction</SelectItem>
                      <SelectItem value="transit">Transport Link</SelectItem>
                      <SelectItem value="dining">Dining / Food</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="distance" className="text-xs uppercase tracking-widest font-bold">Distance/Duration</Label>
                  <Input
                    id="distance"
                    placeholder="e.g. 5 mins walk"
                    value={manualPoi.distanceText}
                    onChange={(e) => setManualPoi({ ...manualPoi, distanceText: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleManualAddPoi} className="w-full sm:w-auto font-bold uppercase tracking-widest text-[10px]">
                  Add Point of Interest
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-4 sm:px-6 mt-4">
        {/* Selected POIs List */}
        <div className="space-y-3">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Selected Highlights ({selectedPois.length})</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedPois.length === 0 && !isLoadingSaved && (
              <div className="col-span-full py-8 border border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                <p className="text-xs">No POIs selected yet.</p>
                <p className="text-[10px]">Select from suggestions below or add custom ones.</p>
              </div>
            )}
            
            {isLoadingSaved ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : (
                selectedPois.map((poi, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-background group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-secondary/50 text-primary">
                    {getPoiIcon(poi.type)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{poi.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        placeholder="e.g. 5 mins walk" 
                        className="h-6 text-[10px] w-24 border-none bg-secondary/30 focus-visible:ring-0 p-1"
                        value={poi.distanceText || ""}
                        onChange={(e) => {
                            const newPois = [...selectedPois];
                            newPois[i] = { ...newPois[i], distanceText: e.target.value };
                            setSelectedPois(newPois);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemovePoi(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )))}
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Suggestions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Auto-Suggestions</Label>
            {coordinates ? (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Navigation className="w-3 h-3" />
                    <span>Based on your location</span>
                </div>
            ) : (
                <p className="text-xs text-amber-500">Add address to see suggestions</p>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-9 bg-secondary/50">
              <TabsTrigger value="sights" className="text-xs">Sights</TabsTrigger>
              <TabsTrigger value="transit" className="text-xs">Transport</TabsTrigger>
              <TabsTrigger value="dining" className="text-xs">Dining</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
               {isLoadingSuggestions ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                   </div>
               ) : (
                <ScrollArea className="h-[250px] w-full rounded-md border border-dashed p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredSuggestions?.length === 0 && (
                        <p className="col-span-full text-center py-10 text-xs text-muted-foreground italic">
                            No suggestions found in this category.
                        </p>
                    )}
                    {filteredSuggestions?.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleAddPoi(suggestion)}
                        disabled={selectedPois.some(p => p.name === suggestion.displayName.text)}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-sm border bg-secondary/10 hover:bg-secondary/30 text-left transition-all group",
                            selectedPois.some(p => p.name === suggestion.displayName.text) && "opacity-50 cursor-not-allowed border-green-500/50 bg-green-50/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-medium leading-tight">{suggestion.displayName.text}</span>
                        </div>
                        <Plus className={cn(
                            "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors",
                            selectedPois.some(p => p.name === suggestion.displayName.text) && "text-green-500"
                        )} />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
               )}
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
