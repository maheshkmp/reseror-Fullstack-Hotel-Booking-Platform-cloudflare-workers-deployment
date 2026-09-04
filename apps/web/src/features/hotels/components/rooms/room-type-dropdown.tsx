"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetRoomTypes } from "../../queries/use-get-rooms";

type Props = {
  hotelId: string;
  onSelect: (roomTypeId: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function RoomTypeDropdown({
  hotelId,
  onSelect,
  value,
  placeholder = "Select room type",
  disabled = false
}: Props) {
  const { data: roomTypesData, isLoading } = useGetRoomTypes(hotelId);

  return (
    <Select
      disabled={disabled || isLoading}
      value={value}
      onValueChange={onSelect}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roomTypesData?.data?.map((roomType: any) => (
          <SelectItem key={roomType.id} value={roomType.id}>
            <div className="flex justify-between items-center w-full">
              <span>{roomType.name}</span>
              <span className="text-muted-foreground ml-2">
                ${roomType.basePrice}/night
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
