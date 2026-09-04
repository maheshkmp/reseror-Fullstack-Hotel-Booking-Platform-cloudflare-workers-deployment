import rpc from "core/rpc";

export const getClient = async () => {
  return rpc(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    fetch: (input: string | URL | Request, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        credentials: "include", // Ensure cookies are sent with requests
      });
    }
  });
};
