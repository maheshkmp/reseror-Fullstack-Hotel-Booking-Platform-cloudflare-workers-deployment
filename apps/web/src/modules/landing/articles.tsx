import { getClient } from "@/lib/rpc/server";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

type Article = {
  id: string;
  userId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type Props = {};

export async function Articles({}: Props) {
  const rpcClient = await getClient();

  let articles: Article[] = [];

  try {
    const articlesRes = await rpcClient.api.article.$get({
      query: {
        page: "1",
        limit: "9",
        sort: "desc",
        search: "",
      },
    });

    if (articlesRes.ok) {
      const apiResponse = await articlesRes.json();
      articles = apiResponse.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch articles", err);
  }

  // Use hardcoded high-quality fallback articles if database is empty
  if (!articles || articles.length === 0) {
    articles = [
      {
        id: "dummy-art-1",
        userId: "u1",
        title: "Top 10 Hidden Gems to Visit in Sri Lanka's Hill Country",
        slug: "top-10-hidden-gems-sri-lanka",
        content: "Discover scenic tea plantations, secret waterfalls, and train rides through mist-covered mountain passes.",
        featuredImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "dummy-art-2",
        userId: "u2",
        title: "The Ultimate Guide to Galle Fort: History & Culinary Delights",
        slug: "galle-fort-ultimate-guide",
        content: "Stroll along 400-year-old ramparts and explore boutique cafes, jewelry shops, and colonial architecture.",
        featuredImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      },
      {
        id: "dummy-art-3",
        userId: "u3",
        title: "Surfing & Sunsets: A Traveler's Dream on the South Coast",
        slug: "surfing-sunsets-south-coast",
        content: "From Mirissa whale watching to Arugam Bay point breaks, experience coastal bliss in Sri Lanka.",
        featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString()
      }
    ];
  }

  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 3);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="inline-block text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
              Travel Stories
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore our latest stories
            </h2>
            <p className="text-gray-500 mt-2">
              Discover news, articles, and travel inspiration
            </p>
          </div>
          {articles.length > 3 && (
            <Link
              href="/article"
              className="flex items-center gap-1 text-sm font-medium text-[#1E3A5F] hover:text-amber-500 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured — spans 2 cols */}
          <Link
            href={`/article/${featuredArticle.slug}`}
            className="lg:col-span-2 block group relative rounded-3xl overflow-hidden shadow-md aspect-[4/3]"
          >
            {featuredArticle.featuredImage ? (
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-blue-800" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
                {featuredArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
                {featuredArticle.content && (
                  <span>{featuredArticle.content.slice(3, 100)}...</span>
                )}
              </div>
              {/* <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white/70 text-xs ml-1">(280 Visitor's)</span>
              </div> */}
            </div>
          </Link>

          {/* Sidebar — 2 stacked cards */}
          <div className="flex flex-col gap-4">
            {sidebarArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="block group relative rounded-3xl overflow-hidden shadow-md flex-1"
                style={{ minHeight: "0", aspectRatio: "4/3" }}
              >
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-blue-500" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-base leading-snug mb-1">
                    {article.title}
                  </h3>
                  {article.content && (
                    <p className="text-white/65 text-xs mb-1.5 line-clamp-1">
                      {article.content}
                    </p>
                  )}
                  {/* <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-white/65 text-xs ml-1">(280 Visitor's)</span>
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}