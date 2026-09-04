"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, HomeIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAd() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ads/${id}`);
        if (!res.ok) throw new Error("Failed to fetch ad");
        const data = await res.json();
        setAd(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAd();
  }, [id]);

  if (loading) {
    return (
      <Card className="mt-8">
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading ad details...
        </CardContent>
      </Card>
    );
  }

  if (error || !ad) {
    return (
      <Card className="mt-8 bg-red-50 border-none">
        <CardContent className="py-12 text-center text-destructive">
          {error || "Ad not found."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-3 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full border flex items-center justify-center bg-blue-50">
              <HomeIcon className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{ad.title}</h2>
              <p className="text-xs text-muted-foreground">
                Added{" "}
                {ad.createdAt
                  ? formatDistanceToNow(new Date(ad.createdAt))
                  : "recently"}{" "}
                ago
              </p>
              <Badge
                variant={ad.isActive ? "secondary" : "outline"}
                className="ml-2"
              >
                {ad.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            {ad.description && (
              <div>
                <span className="font-medium">Description:</span>{" "}
                {ad.description}
              </div>
            )}
            {ad.hotelId && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-blue-500" />
                <span>Hotel: {ad.hotelId}</span>
              </div>
            )}
            {ad.roomId && <div>Room: {ad.roomId}</div>}
            {ad.restaurantId && <div>Restaurant: {ad.restaurantId}</div>}
            {ad.placement && <div>Placement: {ad.placement}</div>}
            {ad.priority && <div>Priority: {ad.priority}</div>}
            {ad.startDate && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <span>Start: {ad.startDate}</span>
              </div>
            )}
            {ad.endDate && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <span>End: {ad.endDate}</span>
              </div>
            )}
            {ad.redirectUrl && (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-teal-500" />
                <a
                  href={ad.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {ad.redirectUrl}
                </a>
              </div>
            )}
            {ad.imageUrl && (
              <div className="mt-4">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="rounded-lg max-h-64"
                />
              </div>
            )}
          </div>
          <div className="mt-8 flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
