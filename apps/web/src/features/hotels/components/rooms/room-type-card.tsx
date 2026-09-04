"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  EditIcon,
  Eye,
  EyeIcon,
  SquareDashedIcon,
  Trash2,
  Users,
} from "lucide-react";
import { type RoomTypeWithRelations } from "core/zod";

type Props = {
  roomType: RoomTypeWithRelations;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RoomTypeCard({ roomType, onEdit, onDelete }: Props) {
  const getViewTypeIcon = (viewType: string) => {
    return <Eye className="h-4 w-4" />;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  return (
    <Card className="w-full shadow-none flex flex-col gap-2 pb-0 overflow-hidden">
      <CardHeader className="">
        <div className="flex justify-between items-start">
          <div className="flex-1 flex flex-col gap-1">
            <CardTitle className="text-lg font-bold">{roomType.name}</CardTitle>
            <CardDescription className="text-xs truncate max-w-[200px]">
              {roomType.description || "No description available"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className="rounded-full"
              variant={getStatusColor(roomType.status || false)}
            >
              {roomType.status ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="border-0 border-y grid grid-cols-3 text-sm">
          <div className="w-full flex items-center gap-3 py-1">
            <Users className="size-4 text-[#003580]" />

            <div className="space-y-0 flex flex-col">
              <span className="text-[9px] text-[#003580]">Occupancy</span>
              <span className="text-sm text-[#002147] font-semibold">
                {`${roomType.baseOccupancy}-${roomType.maxOccupancy}`}
              </span>
            </div>
          </div>

          <div className="w-full flex items-center gap-3 py-1">
            <SquareDashedIcon className="size-4 text-[#003580]" />

            <div className="space-y-0 flex flex-col">
              <span className="text-[9px] text-[#003580]">Size</span>
              <span className="text-sm text-[#002147] font-semibold">
                {`${roomType.roomSizeSqm} m`}
                <sup>2</sup>
              </span>
            </div>
          </div>

          <div className="w-full flex items-center gap-3 py-1">
            <DollarSign className="size-4 text-[#003580]" />

            <div className="space-y-0 flex flex-col">
              <span className="text-[9px] text-[#003580]">Price</span>
              <span className="text-sm text-[#002147] font-semibold">
                ${roomType.price || "0"}
              </span>
            </div>
          </div>
        </div>

        {roomType.amenities && roomType.amenities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-1">
              {roomType.amenities.slice(0, 6).map((amenity) => (
                <Badge key={amenity.id} variant="outline" className="text-xs">
                  {amenity.amenityType}
                </Badge>
              ))}
              {roomType.amenities.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{roomType.amenities.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Badge
          variant={"outline"}
          className="mb-3 flex items-center gap-1 bg-secondary border-primary/20"
        >
          <EyeIcon className="h-4 w-4 mr-1 " />
          <span className="capitalize ">{roomType.viewType} View</span>
        </Badge>
      </CardContent>

      <CardFooter className="p-0 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          icon={<EditIcon className="h-4 w-4 mr-1" />}
          className="flex-1 text-xs w-full border-0 py-5 border-t border-r rounded-none bg-secondary/40 hover:bg-secondary/50 cursor-pointer"
        >
          Update
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          icon={<Trash2 className="h-4 w-4 mr-1" />}
          className="flex-1 text-xs w-full border-0 py-5 border-t border-r rounded-none bg-secondary/40 hover:bg-secondary/50 hover:text-red-600 transition-colors cursor-pointer"
        >
          Remove
        </Button>

        {roomType.rooms && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 capitalize w-full border-0 py-5 border-t rounded-none bg-secondary/40 hover:bg-secondary/50"
          >
            <Badge
              className="rounded-full font-semibold text-sm"
              variant={"secondary"}
            >
              {roomType.rooms.length}
            </Badge>{" "}
            Room
            {roomType.rooms.length !== 1 ? "s" : ""}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
