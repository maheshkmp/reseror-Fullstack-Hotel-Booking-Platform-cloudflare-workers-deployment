export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
  }).then((r) => r.json());
  return response;
}
