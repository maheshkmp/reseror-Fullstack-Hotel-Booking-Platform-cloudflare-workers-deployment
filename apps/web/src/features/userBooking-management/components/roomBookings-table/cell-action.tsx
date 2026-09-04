// "use client";

// import { MoreHorizontal, UserPenIcon } from "lucide-react";
// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // import { RoomBookingSelectType } from "@/features/roomBookings/schemas/roomBookings.schema";

// // interface CellActionProps {
// //   data: RoomBookingSelectType;
// // }

// export const CellAction: React.FC = ({}) => {
//   const [isUpdateOpen, setUpdateOpen] = useState(false);

//   return (
//     <>
//       {/* Update Sheet */}
//       {/* <UpdateUserSheet
//         open={isUpdateOpen}
//         setOpen={setUpdateOpen}
//         updateUserId={data.id}
//       /> */}

//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>

//           {/* Update Sheet */}
//           <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
//             <UserPenIcon className="mr-2 h-4 w-4" /> Update
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };

// "use client";

// import { MoreHorizontal, UserPenIcon } from "lucide-react";
// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { BookingUpdateModal } from "./booking-update-model"; // new component

// interface CellActionProps {
//   bookingId: string;
// }

// export const CellAction: React.FC<CellActionProps> = ({ bookingId }) => {
//   const [isUpdateOpen, setUpdateOpen] = useState(false);

//   return (
//     <>
//       <BookingUpdateModal
//         bookingId={bookingId}
//         open={isUpdateOpen}
//         setOpen={setUpdateOpen}
//       />

//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
//             <UserPenIcon className="mr-2 h-4 w-4" /> Update
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPenIcon } from "lucide-react";
import { useState } from "react";
import { UpdateBookingPayload } from "../../../hotels/queries/use-update-booking-details-by-id";
import { BookingUpdateModal } from "./booking-update-model";

interface CellActionProps {
  bookingId: string;
  initialData: UpdateBookingPayload;
}

export const CellAction: React.FC<CellActionProps> = ({
  bookingId,
  initialData,
}) => {
  const [isUpdateOpen, setUpdateOpen] = useState(false);

  return (
    <>
      <BookingUpdateModal
        bookingId={bookingId}
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        initialData={initialData}
      />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" 
          onClick={() => setUpdateOpen(true)}
          title="Update Booking"
        >
          <UserPenIcon className="h-4 w-4" />
        </Button>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
              <UserPenIcon className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
