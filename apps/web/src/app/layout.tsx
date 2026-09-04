import { Providers } from "@/modules/layouts/providers";
import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { fontHeading, fontSans, fontSerif } from "../lib/fonts";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Reseror.com",
  description:
    "Welcome to Reseror.com, your one-stop destination for all your travel needs. Explore, book, and enjoy your perfect getaway.",
  icons: {
    icon: "/assets/reseror-icon.png",
    shortcut: "/assets/reseror-icon.png",
    apple: "/assets/reseror-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${fontSans.variable} ${fontHeading.variable} ${fontSerif.variable} font-sans antialiased`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassName} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Suspense>
              {children}
              <Toaster position="bottom-left" />
            </Suspense>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
