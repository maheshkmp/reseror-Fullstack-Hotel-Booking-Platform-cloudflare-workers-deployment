"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1 px-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={`relative group h-10 px-3 rounded-xl text-sm transition-all duration-300 gap-3 overflow-hidden ${
                    isActive
                      ? "text-zinc-900 font-bold"
                      : "text-zinc-500 font-medium hover:text-zinc-900 hover:bg-zinc-100/50"
                  }`}
                  style={isActive ? {
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                    background: "linear-gradient(to bottom, #ffffff, #f4f4f5)",
                    border: "1px solid rgba(0, 1, 88, 0.18)"
                  } : {}}
                >
                  <Link href={item.url} className="flex items-center w-full">
                    <AnimatePresence mode="wait">
                      {mounted && isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute left-0 w-1 h-5 bg-zinc-900 rounded-r-full"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {item.icon && (
                      <item.icon 
                        size={19} 
                        className={`transition-colors duration-300 ${
                          isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
                        }`} 
                      />
                    )}
                    <span className="relative z-10 transition-colors duration-300">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
