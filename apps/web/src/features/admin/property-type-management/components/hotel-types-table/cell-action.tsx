"use client";

import { MoreHorizontal, UserPenIcon } from "lucide-react";
import { useState } from "react";

import { HotelType } from "@/features/hotels/schemas/hotel.schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CellAction: React.FC<HotelType> = ({ data }) => {
  const [isUpdateOpen, setUpdateOpen] = useState(false);

  return (
    <>
      {/* Update Sheet */}
      {/* <UpdateUserSheet
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        updateUserId={data.id}
      /> */}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Update Sheet */}
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <UserPenIcon className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
