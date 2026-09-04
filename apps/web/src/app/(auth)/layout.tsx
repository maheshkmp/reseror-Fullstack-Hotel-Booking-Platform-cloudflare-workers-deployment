"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-4 md:p-6">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/80 dark:from-blue-950/30 dark:via-background dark:to-yellow-950/30" />
      <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-blue-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-yellow-400/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md space-y-4">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/assets/reseror.png"
              alt="Reseror.com logo"
              width={112}
              height={32}
              className="h-8 w-auto object-contain"
              style={{ height: "auto" }}
              priority
            />
          </Link>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          {children}
        </motion.div>

        <p className="px-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Reseror.com. All rights reserved.
        </p>
      </div>
    </div>
  );
}
