// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { MoreHorizontal, UserPenIcon } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   UpdateBookingPayload,
//   useUpdateBookingDetailsByID,
// } from "../../../../hotels/queries/use-update-booking-details-by-id";

// type CellActionProps = {
//   bookingId: string;
//   initialData: UpdateBookingPayload;
// };

// export const CellAction: React.FC<CellActionProps> = ({
//   bookingId,
//   initialData,
// }) => {
//   const [isUpdateOpen, setUpdateOpen] = useState(false);
//   const mutation = useUpdateBookingDetailsByID();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<UpdateBookingPayload>({
//     defaultValues: initialData,
//   });

//   const onSubmit = async (data: UpdateBookingPayload) => {
//     try {
//       await mutation.mutateAsync({ id: bookingId, data });
//       setUpdateOpen(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       {/* Update Booking Dialog */}
//       <Dialog open={isUpdateOpen} onOpenChange={setUpdateOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Update Booking</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Guest Name</Label>
//                 <Input {...register("guestName")} disabled={isSubmitting} />
//                 {errors.guestName && (
//                   <p className="text-red-500 text-sm">
//                     {errors.guestName.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input {...register("guestEmail")} disabled={isSubmitting} />
//                 {errors.guestEmail && (
//                   <p className="text-red-500 text-sm">
//                     {errors.guestEmail.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Phone</Label>
//                 <Input {...register("guestPhone")} disabled={isSubmitting} />
//                 {errors.guestPhone && (
//                   <p className="text-red-500 text-sm">
//                     {errors.guestPhone.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Status</Label>
//                 <select
//                   {...register("status")}
//                   disabled={isSubmitting}
//                   className="w-full border rounded-md p-2"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="cancelled">Cancelled</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setUpdateOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isSubmitting || mutation.isPending}
//               >
//                 {mutation.isPending ? "Updating..." : "Update Booking"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Dropdown Menu */}
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  UpdateBookingPayload,
  useUpdateBookingDetailsByID,
} from "../../../hotels/queries/use-update-booking-details-by-id";

type BookingUpdateModalProps = {
  bookingId: string; // The ID of the booking to update
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData: UpdateBookingPayload;
};

export const BookingUpdateModal: React.FC<BookingUpdateModalProps> = ({
  bookingId,
  open,
  setOpen,
  initialData,
}) => {
  const mutation = useUpdateBookingDetailsByID();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBookingPayload>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: UpdateBookingPayload) => {
    try {
      // Pass bookingId as the path parameter correctly
      await mutation.mutateAsync({ id: bookingId, data });
      setOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Guest Name</Label>
              <Input {...register("guestName")} disabled={isSubmitting} />
              {errors.guestName && (
                <p className="text-red-500 text-sm">
                  {errors.guestName.message}
                </p>
              )}
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register("guestEmail")} disabled={isSubmitting} />
              {errors.guestEmail && (
                <p className="text-red-500 text-sm">
                  {errors.guestEmail.message}
                </p>
              )}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("guestPhone")} disabled={isSubmitting} />
              {errors.guestPhone && (
                <p className="text-red-500 text-sm">
                  {errors.guestPhone.message}
                </p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <select
                {...register("status")}
                disabled={isSubmitting}
                className="w-full border rounded-md p-2"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
