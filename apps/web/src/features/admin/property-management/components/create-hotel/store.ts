import { create } from "zustand";

interface CreateHotelStore {
  activeTab: "user" | "hotel";

  userId: string | null;
  organizationId: string | null;

  hotelId: string | null;

  setActiveTab: (tab: "user" | "hotel") => void;

  setUserId: (id: string | null) => void;
  setOrganizationId: (id: string | null) => void;

  setHotelId: (id: string | null) => void;
}

export const useCreateHotelStore = create<CreateHotelStore>((set) => ({
  activeTab: "user",

  userId: null,
  organizationId: null,
  hotelId: null,

  setActiveTab: (tab: "user" | "hotel") => set({ activeTab: tab }),

  setUserId: (id: string | null) => set({ userId: id }),
  setOrganizationId: (id: string | null) => set({ organizationId: id }),

  setHotelId: (id: string | null) => set({ hotelId: id })
}));
