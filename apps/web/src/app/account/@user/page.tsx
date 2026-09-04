"use client";

import { format } from "date-fns";
import Link from "next/link";
// import { SignoutButton } from "@/features/auth/components/signout-button";
import { useGetRoomBookingsByUser } from "@/features/userBooking-management/api/get-room-bookings-by-user-id";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  DiamondIcon, 
  MessageSquareIcon, 
  FolderIcon, 
  Calendar,
  Flag,
  Phone,
  PencilIcon,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateUserDetails } from "@/features/profile/actions/get-user-detail";
import { toast } from "sonner";
import { useGetWishlist } from "@/features/wishlist/actions/use-get-wishlist";
import { WishlistCard } from "@/features/wishlist/components/wishlist.card";

type Props = {};

export default function UserAccountPage({}: Props) {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as "activity" | "bookings" | "wishlist") || "activity";
  const [activeTab, setActiveTab] = useState<"activity" | "bookings" | "wishlist">(initialTab);
  
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "activity" || tab === "bookings" || tab === "wishlist") {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Dialog States
  const [isBioDialogOpen, setIsBioDialogOpen] = useState(false);
  const [isPersonalInfoDialogOpen, setIsPersonalInfoDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form States
  const [bio, setBio] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    phoneNumber: "",
    nationality: "",
    dateOfBirth: "",
  });

  // Sync state with session data
  useEffect(() => {
    if (session?.user) {
      setBio((session.user as any).bio || "");
      setPersonalInfo({
        phoneNumber: (session.user as any).phoneNumber || "",
        nationality: (session.user as any).nationality || "",
        dateOfBirth: (session.user as any).dateOfBirth ? format(new Date((session.user as any).dateOfBirth), "yyyy-MM-dd") : "",
      });
    }
  }, [session]);

  const handleUpdateBio = async () => {
    setIsUpdating(true);
    try {
      await updateUserDetails({ bio });
      toast.success("About section updated successfully!");
      setIsBioDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update about section.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    setIsUpdating(true);
    try {
      await updateUserDetails({ 
        ...personalInfo, 
        dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined 
      });
      toast.success("Personal information updated successfully!");
      setIsPersonalInfoDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update personal information.");
    } finally {
      setIsUpdating(false);
    }
  };

  const {
    data: bookingsRes,
    isLoading,
  } = useGetRoomBookingsByUser(userId, {
    page: 1,
    limit: 6,
    sort: "desc",
  });
  
  const {
    data: wishlistRes,
    isLoading: isWishlistLoading,
  } = useGetWishlist({ page: 1, limit: 12 });

  const bookings = bookingsRes?.data || [];
  
  // Combine bookings and account creation into a unified activity timeline
  const activities = [
    ...bookings.map((b: any) => ({
      id: b.id,
      type: "booking" as const,
      date: new Date(b.checkInDate || b.createdAt),
      data: b
    })),
    ...(session?.user?.createdAt ? [{
      id: "account-creation",
      type: "account_created" as const,
      date: new Date(session.user.createdAt),
      data: session.user
    }] : [])
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const userName = session?.user?.name || "Guest User";
  const userInitials = userName.charAt(0).toUpperCase();

  const tabs = [
    { id: "activity", label: "Activity" },
    { id: "bookings", label: "Bookings" },
    { id: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Left Sidebar: Profile & About */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-8">
            <div className="text-center md:text-left ">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={userName}
                  width={140}
                  height={140}
                  className="rounded-full mx-auto md:mx-0 object-cover shadow-sm border-4 border-white"
                />
              ) : (
                <div className="w-[140px] h-[140px] rounded-full bg-[#1E3A5F] flex items-center justify-center text-4xl font-bold text-white mx-auto md:mx-0 shadow-sm border-4 border-white">
                  {userInitials}
                </div>
              )}
              
              <h1 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                {userName}
              </h1>
            </div>

            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {bio || "Just a traveler. Exploring the world one hotel at a time. Currently crafting memories across the globe."}
              </p>
              <button 
                onClick={() => setIsBioDialogOpen(true)}
                className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-900 border border-gray-200 px-4 py-2 rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <PencilIcon className="w-3 h-3" />
                Edit Bio
              </button>
            </section>

            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Details</h2>
              <div className="space-y-3">
                <DetailLink icon={Phone} label="Phone" value={personalInfo.phoneNumber || "Not set"} />
                <DetailLink icon={Flag} label="Nationality" value={personalInfo.nationality || "Not set"} />
                <DetailLink icon={Calendar} label="Birthday" value={personalInfo.dateOfBirth || "Not set"} />
              </div>
              <button 
                onClick={() => setIsPersonalInfoDialogOpen(true)}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-900 border border-gray-200 px-4 py-2 rounded-md bg-white hover:bg-gray-50 transition-colors w-full justify-center"
              >
                <PencilIcon className="w-3 h-3" />
                Edit details
              </button>
            </section>

            {/* 
            <div className="pt-8 space-y-4">
              <Separator className="bg-gray-100" />
              <SignoutButton className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-0 bg-transparent shadow-none font-bold text-xs uppercase tracking-widest gap-3 px-0 transition-all" />
            </div>
            */}
          </aside>

          {/* Right Main Content: Activity Feed */}
          <main className="md:col-span-8 lg:col-span-9">
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.id 
                      ? "text-gray-900" 
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "activity" && (
              <div className="relative space-y-0 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-gray-200">
                {isPending || isLoading ? (
                  <div className="pl-10 space-y-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100/50 animate-pulse rounded-lg"></div>)}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="pl-10 py-8 text-gray-400 text-sm italic">
                    No recent activities to show.
                  </div>
                ) : (
                  activities.map((activity, index) => (
                    <ActivityCard key={activity.id} activity={activity} index={index} />
                  ))
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Booking History</h3>
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((b: any, index: number) => (
                    <BookingItemCard key={b.id} booking={b} index={index} />
                  ))}
                  {bookings.length === 0 && <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest bg-gray-50/30 rounded-xl border border-dashed border-gray-200">No bookings found.</div>}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Your Favorites</h3>
                  {wishlistRes?.data?.length > 0 && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                      {wishlistRes.data.length} items
                    </span>
                  )}
                </div>

                {isWishlistLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-48 bg-gray-100/50 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : wishlistRes?.data?.length === 0 ? (
                  <div className="py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">Your wishlist is currently empty.</p>
                    <Link href="/">
                      <button className="mt-4 text-xs font-bold text-[#003580] hover:underline uppercase tracking-widest">
                        Explore Hotels →
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistRes.data.map((item: any) => (
                      item.hotelId && <WishlistCard key={item.id} id={item.id} hotelId={item.hotelId} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Edit Bio Dialog */}
      <Dialog open={isBioDialogOpen} onOpenChange={setIsBioDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit About Section</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bio" className="font-bold text-xs uppercase tracking-widest text-gray-400">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[150px] resize-none focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBioDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
            <Button 
              onClick={handleUpdateBio} 
              disabled={isUpdating}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Info Dialog */}
      <Dialog open={isPersonalInfoDialogOpen} onOpenChange={setIsPersonalInfoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Personal Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="font-bold text-xs uppercase tracking-widest text-gray-400">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nationality" className="font-bold text-xs uppercase tracking-widest text-gray-400">Nationality</Label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nationality"
                  placeholder="e.g. American, Sri Lankan"
                  value={personalInfo.nationality}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth" className="font-bold text-xs uppercase tracking-widest text-gray-400">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPersonalInfoDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
            <Button 
              onClick={handleUpdatePersonalInfo} 
              disabled={isUpdating}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailLink({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{label}</span>
      </div>
      <span className="text-sm text-blue-500 font-medium truncate max-w-[150px]">{value}</span>
    </div>
  );
}

function ActivityCard({ activity, index }: { activity: any, index: number }) {
  const dateStr = format(activity.date, "yyyy-MM-dd");
  
  if (activity.type === "account_created") {
    return (
      <div className="flex gap-6 pb-10 last:pb-0 group">
        <div className="z-10 bg-[#F9FAFB] py-1 shrink-0 h-max">
          <UserPlus className="w-5 h-5 text-blue-600 fill-blue-50" />
        </div>
        <div className="flex-1 pt-1 flex justify-between items-start gap-4">
          <div>
            <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Joined Reseror
            </h4>
            <p className="text-sm font-medium text-gray-400 mt-1">
              Started the journey with Reseror. Welcome aboard!
            </p>
          </div>
          <span className="text-sm font-medium text-gray-300 whitespace-nowrap pt-0.5">{dateStr}</span>
        </div>
      </div>
    );
  }

  const booking = activity.data;
  const isConfirmed = booking.status === "confirmed";
  
  return (
    <div className="flex gap-6 pb-10 last:pb-0 group">
      <div className="z-10 bg-[#F9FAFB] py-1 shrink-0 h-max">
        {isConfirmed ? (
          <DiamondIcon className="w-5 h-5 text-gray-900 fill-white" />
        ) : (
          <MessageSquareIcon className="w-5 h-5 text-gray-900 fill-white" />
        )}
      </div>
      <div className="flex-1 pt-1 flex justify-between items-start gap-4">
        <div>
          <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {isConfirmed ? (
              <>Stay confirmed at <span className="text-gray-900 underline decoration-gray-300 underline-offset-4 decoration-2">{booking.hotel?.name || "Luxury Stay"}</span></>
            ) : (
              <>New booking inquiry for <span className="text-gray-900 underline decoration-gray-300 underline-offset-4 decoration-2">{booking.hotel?.name || "Resort"}</span></>
            )}
          </h4>
          <p className="text-sm font-medium text-gray-400 mt-1">
            {isConfirmed ? "Booking completed successfully." : "Inquiry sent to property owner."}
          </p>
          
        
        </div>
        <span className="text-sm font-medium text-gray-300 whitespace-nowrap pt-0.5">{dateStr}</span>
      </div>
    </div>
  );
}

function BookingItemCard({ booking, index }: { booking: any; index: number }) {
  const checkIn = booking.checkInDate ? format(new Date(booking.checkInDate), "MMM dd") : "—";
  const checkOut = booking.checkOutDate ? format(new Date(booking.checkOutDate), "MMM dd, yyyy") : "—";

  return (
     <div className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:shadow-lg transition-all group">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center font-black text-[#1E3A5F] group-hover:bg-[#1E3A5F]/5">
              {checkIn.split(' ')[1]}
           </div>
           <div>
              <h4 className="font-black text-gray-900">{booking.hotel?.name || "Luxury Stay"}</h4>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{checkIn} — {checkOut}</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${booking.status === "confirmed" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
              {booking.status}
           </span>
           <Link href={`/account/booking-details/${booking.id}`}>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E3A5F] hover:underline">Manage →</button>
           </Link>
        </div>
     </div>
  );
}
