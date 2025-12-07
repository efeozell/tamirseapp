import { create } from "zustand";
import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";

interface BusinessStats {
  // Overall stats
  totalEarnings: number;
  completedRequests: number;
  activeRequests: number;
  averageRating: number;

  // Today's stats
  todayEarnings: number;
  todayRequests: number;
  completedToday: number;
  rejectedToday: number;

  // Status counts
  pendingApproval: number;
  inProgress: number;

  // Advanced stats
  averageServiceTime: number;
  repeatCustomerPercentage: number;
}

interface BusinessStatsState {
  stats: BusinessStats | null;
  isLoading: boolean;

  fetchBusinessStats: (businessId: string) => Promise<void>;
}

export const useBusinessStatsStore = create<BusinessStatsState>((set) => ({
  stats: null,
  isLoading: false,

  fetchBusinessStats: async (businessId: string) => {
    set({ isLoading: true });
    try {
      const stats = await apiClient.get<BusinessStats>(API_ENDPOINTS.BUSINESS_STATS(businessId));
      set({ stats, isLoading: false });
    } catch (error) {
      console.error("Error fetching business stats:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
