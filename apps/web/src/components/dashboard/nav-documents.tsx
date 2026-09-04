"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
    badge?: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="px-5 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
        Management
      </SidebarGroupLabel>
      <SidebarMenu className="px-2 gap-1">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={`relative group h-10 px-3 rounded-xl text-sm transition-all duration-300 gap-3 overflow-hidden ${
                  isActive
                    ? "text-zinc-900 font-bold"
                    : "text-zinc-500 font-medium hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
                style={isActive ? {
                  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 2px 4px -1px rgba(25, 3, 91, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                  background: "linear-gradient(to bottom, #ffffff, #f4f4f5)",
                  border: "1px solid rgba(21, 1, 75, 0.11)"
                } : {}}
              >
                <Link href={item.url} className="flex items-center w-full">
                  <AnimatePresence mode="wait">
                    {mounted && isActive && (
                      <motion.div
                        layoutId="active-pill-docs"
                        className="absolute left-0 w-1 h-5 bg-zinc-900 rounded-r-full"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  <item.icon 
                    size={19} 
                    className={`transition-colors duration-300 ${
                      isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
                    }`} 
                  />
                  <span className="relative z-10 transition-colors duration-300">
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
              {item.badge && (
                <SidebarMenuBadge className="bg-zinc-900 text-white text-[10px] font-black rounded-full px-2 min-w-[20px] h-5 flex items-center justify-center">
                  {item.badge}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
