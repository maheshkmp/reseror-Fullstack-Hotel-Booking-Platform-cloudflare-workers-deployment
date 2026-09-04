"use client";
import React, { useCallback, useEffect, useId } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppForm } from "@/components/ui/tanstack-form";

import { useUpdateUser } from "../api";
import { useGetUser } from "../api/use-get-user";
import {
  updateUserSchema,
  type UpdateUserSchema
} from "core/zod";

interface UpdateUserSheetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserId: string;
}

export function UpdateUserSheet({
  open,
  setOpen,
  updateUserId
}: UpdateUserSheetProps) {
  const toastId = useId();

  const {
    data: currentUser,
    error: currentUserErr,
    isPending: isFetching
  } = useGetUser({ userId: updateUserId, enabled: open });

  const { mutate, isPending } = useUpdateUser();

  const form = useAppForm({
    validators: { onChange: updateUserSchema },
    defaultValues: {
      userId: updateUserId,
      role: ""
    },
    onSubmit: ({ value }) => handleUpdateUser(value as any)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleUpdateUser = async (values: UpdateUserSchema) => {
    mutate(values, {
      onSuccess() {
        toast.success("User updated successfully!", { id: toastId });
        form.reset();
        setOpen(false);
      },
      onError(error) {
        toast.error(`Failed to update user: ${error.message}`, { id: toastId });
      }
    });
  };

  // Handle user data loading and errors
  useEffect(() => {
    if (currentUserErr) {
      toast.error("Failed to fetch user details", {
        description: currentUserErr.message
      });
    }

    if (currentUser) {
      // Update form values when user data loads
      form.setFieldValue("userId", updateUserId);
      if (currentUser.role) {
        form.setFieldValue("role", currentUser.role);
      }
    }
  }, [currentUserErr, currentUser, updateUserId, form]);

  // Reset form when sheet opens/closes
  useEffect(() => {
    if (open) {
      form.reset();
      form.setFieldValue("userId", updateUserId);
    }
  }, [open, updateUserId, form]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription>
            In here, You can update or assign roles of users
          </SheetDescription>
        </SheetHeader>

        {/* Update Form */}
        {isFetching ? (
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          currentUser && (
            <form.AppForm>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-y-5 my-8">
                  <div className="space-y-2">
                    <Label>User name</Label>
                    <Input
                      disabled
                      value={currentUser.name || ""}
                      placeholder="User name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      disabled
                      value={currentUser.email}
                      placeholder="User email"
                    />
                  </div>

                  <form.AppField
                    name="role"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Role</field.FormLabel>
                        <field.FormControl>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                            onOpenChange={(open) => !open && field.handleBlur()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role for selected user" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                Admin (System Admin)
                              </SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      type="submit"
                      loading={form.state.isSubmitting || isPending}
                    >
                      Save changes
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </form.AppForm>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
