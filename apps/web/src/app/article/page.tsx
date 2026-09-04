"use client";

import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import { ArticleCard } from "./components/article-card";
import { useGetArticles } from "./use-get-article";

export default function ArticlePage() {
  const { data, isLoading, error } = useGetArticles({ limit: 50, sort: "desc" });

  const articles = (data?.data ?? []).filter((a) => a.isPublished);
  const [featured, ...rest] = articles;

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-12 px-4"
        style={{ background: "linear-gradient(140deg, #07143d 0%, #0e2460 50%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">

          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Stories & Guides
          </h1>
          <p className="text-white/45 text-sm mt-3 max-w-sm">
            Travel inspiration, destination guides, and tips from our team.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-14">

        {/* Loading */}
        {isLoading && (
          <div className="animate-pulse space-y-10">
            <div className="h-72 bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-xl" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">📰</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Couldn't load articles</h2>
            <p className="text-gray-400 text-sm mb-6">Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold underline underline-offset-4"
              style={{ color: "#07143d" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && articles.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">📝</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No articles yet</h2>
            <p className="text-gray-400 text-sm">Check back soon for travel stories and guides.</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && articles.length > 0 && (
          <div className="space-y-14">

            {/* Featured */}
            {featured && <ArticleCard article={featured} featured />}

            {/* Divider */}
            {rest.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  More articles
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}