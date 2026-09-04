"use client";

import { useParams } from "next/navigation";
import { useGetArticle } from "@/features/admin/article-management/api/use-get-article";
import ArticleEditor from "@/features/admin/article-management/components/article-editor";
import { Loader2 } from "lucide-react";

export default function EditArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data: article, isLoading, isError } = useGetArticle(slug);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load article or article not found.
      </div>
    );
  }

  return <ArticleEditor article={article} />;
}
