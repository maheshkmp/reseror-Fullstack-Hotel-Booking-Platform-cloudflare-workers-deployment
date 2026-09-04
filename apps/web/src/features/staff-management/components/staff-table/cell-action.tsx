"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Staff } from "../../schemas";
import { useDeleteStaff, useUpdateStaff } from "../../api";
import { AlertModal } from "@/components/modal/alert-modal";
import { StaffEditForm } from "../staff-forms";

interface CellActionProps {
  data: Staff;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { mutate: deleteMutate } = useDeleteStaff();
  const { mutate: updateMutate } = useUpdateStaff();

  const onDelete = async () => {
    setLoading(true);
    deleteMutate(data.id, {
      onSettled: () => {
        setLoading(false);
        setOpenDelete(false);
      },
    });
  };

  const onToggleBan = () => {
    updateMutate({ 
      id: data.id, 
      data: { banned: !data.banned } 
    });
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      
      <StaffEditForm 
        isOpen={openEdit} 
        onClose={() => setOpenEdit(false)} 
        initialData={data} 
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleBan}>
            {data.banned ? (
              <>
                <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" /> Unban Staff
              </>
            ) : (
              <>
                <ShieldOff className="mr-2 h-4 w-4 text-rose-500" /> Ban Staff
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Access
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
