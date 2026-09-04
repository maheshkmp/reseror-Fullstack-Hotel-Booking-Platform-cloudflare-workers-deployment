"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useCreateArticle } from "../api/use-create-article";
import { articleInsertSchema, type articleInsertType } from "core/zod";

const defaultValues: Partial<articleInsertType> = {
  title: "",
  slug: null,
  excerpt: null,
  content: null,
  featuredImage: null,
};

export function CreateArticle({
  triggerRef,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateArticle();
  const [open, setOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const form = useAppForm({
    validators: { onChange: articleInsertSchema },
    defaultValues,
    onSubmit: ({ value }) =>
      mutate(value as articleInsertType, {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
      }),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          icon={<PlusCircleIcon />}
          type="button"
          onClick={() => setOpen(true)}
        >
          Create new Article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Article</DialogTitle>
        </DialogHeader>
        <Card className="w-full rounded-sm shadow-none border-none">
          <CardHeader>
            <CardDescription>
              Provide the details of the article
            </CardDescription>
          </CardHeader>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-y-5 mb-6">
                <form.AppField
                  name="title"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Title</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter article title"
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
                  name="slug"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Slug</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter slug (optional)"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="excerpt"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Excerpt</field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Enter excerpt (optional)"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="content"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Content</field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Enter article content"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="featuredImage"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Featured Image</field.FormLabel>
                      <field.FormControl>
                        <div className="flex gap-2 items-center">
                          {/* <Input
                            disabled={isPending}
                            placeholder="Enter image URL or select from media"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          /> */}
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setMediaDialogOpen(true)}
                          >
                            Choose from Media
                          </Button>
                        </div>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                {/* Media Picker Dialog */}
                <GalleryView
                  modal={true}
                  modalOpen={mediaDialogOpen}
                  setModalOpen={setMediaDialogOpen}
                  activeTab="library"
                  onUseSelected={(selectedFiles) => {
                    if (selectedFiles && selectedFiles.length > 0) {
                      // Use the first selected media file's url
                      form.setFieldValue("featuredImage", selectedFiles[0].url);
                      setMediaDialogOpen(false);
                    }
                  }}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" loading={isPending} disabled={isPending}>
                  Create Article
                </Button>
              </CardFooter>
            </form>
          </form.AppForm>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
