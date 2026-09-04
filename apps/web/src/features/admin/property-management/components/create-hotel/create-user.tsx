"use client";

import { useCreateOrganization } from "@/features/admin/users-management/api/use-create-organization";
import { useCreateUser } from "@/features/admin/users-management/api/use-create-user";
import {
  CreateUserSchema,
  createUserSchema
} from "@/features/admin/users-management/schemas/create-user";
import { toKebabCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useCallback } from "react";
import { useCreateHotelStore } from "./store";

export function CreateUser() {
  const { setUserId, setOrganizationId, setActiveTab } = useCreateHotelStore();
  const { mutate: mutateCreateUser, isPending: userCreating } = useCreateUser();
  const { mutate: mutateCreateOrganization, isPending: organizationCreating } =
    useCreateOrganization();

  const form = useAppForm({
    validators: { onChange: createUserSchema },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user"
    },
    onSubmit: ({ value }) => handleCreateUser(value as any)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleCreateUser = async (values: CreateUserSchema) => {
    mutateCreateUser(values, {
      onSuccess({ user: createdUser }) {
        // Update zustand state
        // console.log({ createdUser });
        setUserId(createdUser.id);

        mutateCreateOrganization(
          {
            name: createdUser.name,
            userId: createdUser.id,
            keepCurrentActiveOrganization: true,
            slug: toKebabCase(createdUser.name),
            logo: ""
          },
          {
            onSuccess(createdOrganization) {
              // Update zustand state
              // console.log({ createdOrganization });
              setOrganizationId(createdOrganization.id);
              setActiveTab("hotel");
            }
          }
        );

        form.reset();
      },
      onError(error) {
        console.log(error);
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading">
          Setup Hotel Owner
        </CardTitle>
        <CardDescription>
          Provide the details of the hotel owner
        </CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-y-5 mb-6">
            <form.AppField
              name="name"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Owner Name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={userCreating}
                      placeholder="Enter hotel owner's name"
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
              name="email"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Owner Email</field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={userCreating}
                      placeholder="Enter hotel owner's email"
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
              name="password"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Owner Password</field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={userCreating}
                      placeholder="Enter hotel owner's password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              loading={userCreating || organizationCreating}
              disabled={userCreating || organizationCreating}
            >
              Setup Hotel Owner
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
