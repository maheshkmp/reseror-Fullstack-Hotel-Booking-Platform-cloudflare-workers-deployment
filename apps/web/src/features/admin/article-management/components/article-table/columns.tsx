"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import type { article } from "core/zod";
import { Pencil, Globe, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteArticle } from "../../api/use-delete-article";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const StatusBadge = React.memo(({ status }: { status: boolean }) => (
  <div className="flex items-center gap-1.5 group/status cursor-default">
    <div className={cn("size-1.5 rounded-full", status ? "bg-emerald-500 animation-pulse" : "bg-amber-500")} />
    <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">
      {status ? "Published" : "Draft"}
    </span>
  </div>
));
StatusBadge.displayName = "StatusBadge";

const CellAction = ({ article }: { article: article }) => {
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteArticle(article.id, {
      onSuccess: () => {
        toast.success("Article deleted");
        queryClient.invalidateQueries({ queryKey: ["articles"] });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button variant="ghost" size="icon" asChild className="size-7 border border-border/20 shadow-none">
        <Link href={`/admin/article-management/${article.slug || article.id}`}>
          <Pencil className="size-3.5 text-muted-foreground" />
        </Link>
      </Button>
      {article.isPublished && (
        <Button variant="ghost" size="icon" asChild className="size-7 border border-border/20 shadow-none">
          <Link href={`/article/${article.slug || article.id}`} target="_blank">
            <Globe className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 border border-border/20 shadow-none hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <Trash2 className="size-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background border-border shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>"{article.title}" will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<article>[] = [
  {
    accessorKey: "title",
    header: "Content",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[400px]">
        <span className="text-[11px] font-bold text-foreground truncate">{row.original.title}</span>
        {row.original.excerpt && (
          <span className="text-[9px] text-muted-foreground truncate opacity-60 mt-0.5">{row.original.excerpt}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded-sm border border-border/30">
        {(row.original as any).category || "General"}
      </span>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.isPublished} />,
  },
  {
    accessorKey: "createdAt",
    header: "Timeline",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-foreground tabular-nums uppercase">
          {new Date(row.original.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
        </span>
        <span className="text-[9px] text-muted-foreground tabular-nums uppercase opacity-60">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction article={row.original} />,
  },
];
