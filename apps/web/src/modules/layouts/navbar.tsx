"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";
import { useGetSettings } from "@/features/admin/settings/api/use-get-settings";
import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  User, 
  Hotel, 
  Plane, 
  Compass, 
  BookOpen, 
  Info, 
  Mail,
  Menu,
  X,
  RefreshCcw,
  UserCog,
  Home
} from "lucide-react";

type Props = {};

export function Navbar({}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: settings } = useGetSettings();
  const { data: myHotel } = useGetMyHotel();
  const user = session?.user;
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleSwitchRole = async (redirectTo?: string) => {
    try {
      const client = await getClient();
      const response = await client.api.auth["switch-role"].$post();

      if (response.ok) {
        // Refresh the session data on the client before redirecting
        await authClient.getSession();
        
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
       console.error("Failed to switch role", error);
    }
  };

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  // On non-home pages, always show solid white nav
  const isSolid = !isHomePage || scrolled;

  const [staysUrl, setStaysUrl] = useState("/search");
  
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setStaysUrl(`/search?checkIn=${today.toISOString()}&checkOut=${tomorrow.toISOString()}&guests=2&rooms=1`);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/search", icon: Compass },
    { label: "Read", href: "/article", icon: BookOpen },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Fixed Navbar */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-6 transition-all duration-300",
          isSolid
            ? "bg-white shadow-sm border-b border-gray-200/70"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              "font-extrabold text-2xl md:text-3xl tracking-tight transition-colors duration-300 flex items-center",
              isSolid ? "text-[#003580]" : "text-white drop-shadow-sm"
            )}
          >
            Reseror
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.label === "Explore" && pathname === "/search");

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative pb-1 text-sm font-semibold tracking-wide transition-colors duration-200",
                  isSolid
                    ? isActive
                      ? "text-[#003580]"
                      : "text-gray-600 hover:text-[#003580]"
                    : isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
                {/* Underline — always present, width animates from 0→full when active */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ease-out",
                    isSolid
                      ? "bg-gradient-to-r from-[#003580] to-transparent"
                      : "bg-gradient-to-r from-white to-transparent",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Download App - Prominent CTA */}
          {session ? (
            <>
              {user?.role !== "admin" && (
                <button
                  type="button"
                  onClick={() => {
                    if (user?.role === "hotelOwner") {
                      if (myHotel) {
                        router.push("/account");
                      } else {
                        router.push("/account/setup");
                      }
                    } else {
                      router.push("/setup-organization?mode=hotelOwner");
                    }
                  }}
                  className={cn(
                    "text-sm font-medium hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-md transition-all duration-200",
                    isSolid
                      ? "text-gray-700 border border-gray-300 hover:bg-gray-100"
                      : "text-white border border-white/30 hover:bg-white/10"
                  )}
                >
                  {user?.role === "hotelOwner" 
                    ? (myHotel ? "Dashboard" : "Setup Property") 
                    : "List your Property"}
                </button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-gray-200">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image || ""} alt={user?.name} className="object-cover" />
                      <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link 
                      href={user?.role === "admin" ? "/admin" : "/account"} 
                      className="flex w-full items-center"
                      target={user?.role === "admin" ? "_blank" : undefined}
                      rel={user?.role === "admin" ? "noopener noreferrer" : undefined}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{user?.role === "admin" ? "Admin Panel" : user?.role === "hotelOwner" ? "Owner Dashboard" : "My Account"}</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role !== "admin" && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/account/profile" className="flex w-full items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      {user?.role !== "user" && (
                        <DropdownMenuItem 
                          className="cursor-pointer font-medium text-blue-600 focus:text-blue-700"
                          onClick={() => {
                          if (user?.role === "hotelOwner") {
                            handleSwitchRole();
                          } else {
                            router.push("/setup-organization?mode=hotelOwner");
                          }
                        }}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          <span>{user?.role === "hotelOwner" ? "Switch to Guest View" : "List your Property"}</span>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "text-sm font-medium hidden sm:inline-flex",
                  isSolid
                    ? "text-gray-700 border border-gray-300 hover:bg-gray-100"
                    : "text-white border border-white/30 hover:bg-white/10"
                )}
              >
                <Link href="/signup?mode=hotelOwner">List your Property</Link>
              </Button>
              <Button
                variant="default"
                className="bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-lg cursor-pointer border-none"
                asChild
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden ml-1 flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isSolid ? "text-gray-700" : "text-white")}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.label === "Explore" && pathname === "/search");

                    return (
                      <SheetTrigger asChild key={link.label}>
                        <Link
                          href={link.href}
                          className={cn(
                            "relative flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors",
                            isActive
                              ? "bg-blue-50 text-[#003580]"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <span className="text-base">{link.label}</span>
                          {isActive && (
                            <span className="absolute bottom-1 left-4 w-10 h-[2px] rounded-full bg-gradient-to-r from-[#003580] to-transparent" />
                          )}
                        </Link>
                      </SheetTrigger>
                    );
                  })}
                  
                  {/* Additional Mobile Links */}
                  <div className="mt-4 border-t pt-4">
                    <SheetTrigger asChild>
                      <Link 
                        href="/download" 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
                      >
                         <div className="w-5 h-5 bg-[#003580]/10 rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#003580]">
                               <path d="M17,1.01L7,1c-1.1,0-2,0.9-2,2v18c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C19,1.91,18.1,1.01,17,1.01z M17,19H7V5h10V19z" />
                            </svg>
                         </div>
                        <span className="text-base">Download App</span>
                      </Link>
                    </SheetTrigger>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Spacer — only on non-home pages since hero covers full viewport */}
      {!isHomePage && <div className="h-16" />}
    </>
  );
}
