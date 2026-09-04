"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

export function AdminSidebarNav({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
    subItems?: {
      name: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubActive = hasSubItems && item.subItems?.some(sub => pathname === sub.url);

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isSubActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.name}
                      className={
                        isSubActive
                          ? "bg-accent/80 text-accent-foreground font-semibold"
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      }
                    >
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span className="text-sm font-medium">{item.name}</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-sidebar-border/50 ml-3.5 pl-2">
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="text-[13px] h-8">
                            <Link href={subItem.url}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                }
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="size-4 shrink-0" />}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
