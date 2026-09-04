// import { getClient } from "@/lib/rpc/server";
// import Image from "next/image";
// import { notFound } from "next/navigation";

// export default async function ArticleDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const rpcClient = await getClient();
//   const res = await rpcClient.api.article[params.id].$get({});
//   if (!res.ok) return notFound();
//   const article = await res.json();

//   return (
//     <div className="max-w-3xl mx-auto py-12 px-4 md:px-6 lg:px-8 bg-white rounded-xl shadow-lg">
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-[#003580] mb-2">
//           {article.title}
//         </h1>
//         <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
//           <span>
//             Published:{" "}
//             {article.createdAt
//               ? new Date(article.createdAt).toLocaleDateString()
//               : ""}
//           </span>
//           {article.userId && <span>Author: {article.userId}</span>}
//         </div>
//         {article.featuredImage ? (
//           <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100">
//             <Image
//               src={article.featuredImage}
//               alt={article.title}
//               width={800}
//               height={400}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ) : (
//           <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-[#003580]/60 via-white/30 to-[#00b4d8]/60 backdrop-blur-md flex items-center justify-center">
//             <span className="text-2xl text-white font-bold">No Image</span>
//           </div>
//         )}
//       </div>
//       <div className="prose prose-lg max-w-none text-gray-800">
//         {article.excerpt && (
//           <blockquote className="mb-6 text-lg text-gray-600 border-l-4 border-[#003580] pl-4 italic">
//             {article.excerpt}
//           </blockquote>
//         )}
//         <div>
//           {article.content ? (
//             <div dangerouslySetInnerHTML={{ __html: article.content }} />
//           ) : (
//             <p className="text-gray-500">No content available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  userId?: string;
  createdAt?: string;
};

export default function ArticleDetailPage() {
  const params = useParams();
  const { data: session } = authClient.useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article/${params.id}`);
        if (!response.ok) {
          setError(true);
          return;
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600">
            The article you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight text-balance">
            {article.title}
          </h1>

          {/* Author Section */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src="/author-profile.png"
                alt="Author"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-blue-600">
                {session?.user?.name || "Anonymous Author"}
              </div>
              <div className="text-gray-600 text-sm">
                {session?.user?.email && (
                  <span className="block text-gray-500 text-xs mb-1">
                    {session.user.email}
                  </span>
                )}
                {article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}{" "}
                • 6 min read
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {article.featuredImage ? (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-16 shadow-2xl">
            <Image
              src={article.featuredImage || "/placeholder.svg"}
              alt={article.title}
              width={1200}
              height={675}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-16 shadow-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6cdBHDy0BCMB4rCU8vJOo1uT8GPMdq.png"
              alt="Default landscape"
              width={1200}
              height={675}
              className="object-cover w-full h-full opacity-80"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="max-w-3xl mx-auto">
          {article.excerpt && (
            <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
              {article.excerpt}
            </div>
          )}

          <div className="prose prose-lg prose-gray max-w-none">
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="text-gray-800 leading-relaxed"
              />
            ) : (
              <p className="text-gray-500 text-center py-12">
                No content available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
