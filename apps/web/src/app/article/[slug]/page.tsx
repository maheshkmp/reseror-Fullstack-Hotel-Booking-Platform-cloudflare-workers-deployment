"use client";

import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetArticleBySlug, useIncrementReadCount } from "../use-get-article";
import { Navbar } from "@/modules/layouts/navbar";
import { Footer } from "@/modules/layouts/footer";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleSlug = params?.slug as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const incrementReadCount = useIncrementReadCount();

  const { data: article, isLoading, error } = useGetArticleBySlug(articleSlug);

  useEffect(() => {
    if (article) {
      incrementReadCount(article.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({ title: article.title, text: article.excerpt ?? "", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-8">
          <div className="h-5 bg-gray-100 rounded w-24" />
          <div className="h-10 bg-gray-100 rounded w-3/4" />
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded w-full" />
          ))}
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-6xl mb-5">🗺️</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Article not found</h1>
            <p className="text-gray-500 mb-8">This article may have been moved or removed.</p>
            <Link
              href="/article"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#003580] underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to articles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link
            href="/article"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookmarked((b) => !b)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                isBookmarked
                  ? "text-[#003580] bg-blue-50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="mb-6">
          <time className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed mb-10 border-l-4 border-[#003580] pl-5">
            {article.excerpt}
          </p>
        )}

        {/* Cover image */}
        {article.featuredImage && (
          <div className="relative w-full h-80 md:h-105 rounded-2xl overflow-hidden mb-12 bg-gray-100">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-a:text-[#003580] prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-[#003580] prose-blockquote:text-gray-600
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />

        {/* Footer actions */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/article"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-semibold text-[#003580] hover:underline underline-offset-4"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
