import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Article } from "../use-get-article";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/article/${article.id}`} className="group block">
        <div className="relative h-120 rounded-2xl overflow-hidden bg-gray-100">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <time className="text-white/60 text-xs font-medium uppercase tracking-widest mb-3 block">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-white/90 transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-white/70 text-base line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <span className="inline-block mt-5 text-sm font-semibold text-white border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
              Read article →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} className="group flex flex-col gap-4">
      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="text-4xl opacity-30">📰</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-gray-400">
          <CalendarIcon className="w-3.5 h-3.5" />
          <time className="text-xs font-medium">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-[#003580] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <span className="text-sm font-semibold text-[#003580] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
          Read more →
        </span>
      </div>
    </Link>
  );
}
