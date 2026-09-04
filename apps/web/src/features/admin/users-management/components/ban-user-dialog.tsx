"use client";
import React, { useCallback, useId } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

import { UserMinus } from "lucide-react";
import { useBanUser } from "../api";
import { banUserSchema, type BanUserSchema } from "core/zod";

type Props = {
  userId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function BanUserDialog({ userId, open, setOpen }: Props) {
  const toastId = useId();
  const { mutate, isPending } = useBanUser();

  const form = useAppForm({
    validators: { onChange: banUserSchema },
    defaultValues: {
      userId: userId,
      banReason: "",
      banExpiresIn: 0
    },
    onSubmit: ({ value }) => handleBanUser(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleBanUser = async (values: BanUserSchema) => {
    mutate(
      {
        ...values,
        banExpiresIn: (values?.banExpiresIn ?? 0) * 60 * 60 * 24
      },
      {
        onSuccess: () => {
          toast.success("User banned successfully!", { id: toastId });
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(`Failed to ban user: ${error.message}`, { id: toastId });
        }
      }
    );
  };

  // Reset form when dialog opens/closes or userId changes
  React.useEffect(() => {
    if (open) {
      form.reset();
      form.setFieldValue("userId", userId);
    }
  }, [open, userId, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to ban the selected user. You can always unban them
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <form.AppField
              name="banReason"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Ban Reason</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="Leave ban reason here..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="banExpiresIn"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Ban Expires (in days)</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      placeholder="Ban duration in days"
                      min={0}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                loading={form.state.isSubmitting || isPending}
                icon={<UserMinus className="size-4" />}
              >
                Ban User
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
