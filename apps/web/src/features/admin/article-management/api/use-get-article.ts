import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

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

      const articles = await articlesRes.json();

      return articles;
    },
  });
};

export const useGetArticle = (slug: string) => {
  return useQuery({
    queryKey: ["article", { slug }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.article.slug[":slug"].$get({
        param: { slug },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch article");
      }

      return await response.json();
    },
    enabled: !!slug,
  });
};
