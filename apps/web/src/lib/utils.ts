import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toKebabCase(str: string) {
  return (
    str
      // Add hyphen before capital letters and convert to lowercase
      .replace(/([A-Z])/g, "-$1")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove any non-alphanumeric characters (except hyphens)
      .replace(/[^\w\s-]/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Remove leading hyphen if present
      .replace(/^-/, "")
      // Replace multiple consecutive hyphens with a single one
      .replace(/-+/g, "-")
  );
}

export function getImageUrl(url: string | null | undefined) {
  if (!url || url.trim() === "") {
    return "https://placehold.co/600x400?text=No+Image";
  }

  // If it's already a full URL or a relative path starting with /
  if (url.startsWith("http") || url.startsWith("/")) {
    return url;
  }

  // If it looks like a domain name without protocol (e.g., www.example.com)
  if (url.includes(".") && !url.startsWith(".")) {
    return `https://${url}`;
  }

  // Otherwise, assume it's a relative path and add the leading slash
  return `/${url}`;
}