"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Pencil, Globe, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useDeleteArticle } from "../api/use-delete-article";
import type { article } from "core/zod";

type Props = {
  article: article;
};

export function ArticleCard({ article }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteArticle(article.id, {
      onSuccess: () => {
        toast.success("Article deleted");
        setShowDeleteDialog(false);
        queryClient.invalidateQueries({ queryKey: ["articles"], exact: false });
      },
      onError: () => {
        toast.error("Failed to delete article");
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Cover image */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
          )}
          {/* Status pill */}
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              article.isPublished
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 text-white"
            }`}
          >
            {article.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1.5">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>

            <div className="flex items-center gap-1">
              <Link
                href={`/admin/article-management/${article.id}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
              {article.isPublished && (
                <Link
                  href={`/article/${article.id}`}
                  target="_blank"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="View live"
                >
                  <Globe className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              "{article.title}" will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
