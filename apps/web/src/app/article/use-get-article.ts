import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Article {
  id: string;
  organizationId: string | null;
  userId: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ArticleFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetArticles = (params: ArticleFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  return useQuery({
    queryKey: ["articles", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const articlesRes = await rpcClient.api.article.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!articlesRes.ok) {
        const errorData = await articlesRes.json();
        throw new Error(errorData.message || "Failed to fetch articles");
      }

      const response: ArticlesResponse = await articlesRes.json();
      return response;
    },
  });
};

export const useGetArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["article", { slug }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.article.slug[":slug"].$get({
        param: { slug },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      return (await response.json()) as Article;
    },
    enabled: !!slug,
  });
};

export const useIncrementReadCount = () => {
  return async (id: string) => {
    const rpcClient = await getClient();
    try {
      await rpcClient.api.article[":id"].read.$post({
        param: { id },
      });
    } catch (e) {
      console.error("Failed to increment read count", e);
    }
  };
};
