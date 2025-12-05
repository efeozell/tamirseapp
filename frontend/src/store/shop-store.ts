import { create } from "zustand";
import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";

export interface Shop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  services: string[];
  estimatedTime: string;
  priceRange: string;
  isOnline: boolean;
  description?: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  images?: string[];
}

export interface ShopReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ShopState {
  shops: Shop[];
  selectedShop: Shop | null;
  shopReviews: Record<string, ShopReview[]>;
  isLoading: boolean;

  // Actions
  fetchShops: (filters?: { services?: string[]; search?: string }) => Promise<void>;
  fetchShopById: (id: string) => Promise<void>;
  fetchShopReviews: (shopId: string) => Promise<void>;
  setSelectedShop: (shop: Shop | null) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops: [],
  selectedShop: null,
  shopReviews: {},
  isLoading: false,

  fetchShops: async (filters) => {
    set({ isLoading: true });
    try {
      // TODO: GET /shops with filters
      const shops = await apiClient.get<Shop[]>(API_ENDPOINTS.BUSINESSES, filters);
      set({ shops, isLoading: false });
    } catch (error) {
      console.error("Error fetching shops:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchShopById: async (id: string) => {
    set({ isLoading: true });
    try {
      // TODO: GET /shops/:id
      const shop = await apiClient.get<Shop>(API_ENDPOINTS.BUSINESS_BY_ID(id));
      set({ selectedShop: shop, isLoading: false });
    } catch (error) {
      console.error("Error fetching shop:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchShopReviews: async (shopId: string) => {
    try {
      // TODO: GET /shops/:id/reviews
      const reviews = await apiClient.get<ShopReview[]>(API_ENDPOINTS.BUSINESS_REVIEWS(shopId));
      set((state) => ({
        shopReviews: {
          ...state.shopReviews,
          [shopId]: reviews,
        },
      }));
    } catch (error) {
      console.error("Error fetching shop reviews:", error);
      throw error;
    }
  },

  setSelectedShop: (shop) => {
    set({ selectedShop: shop });
  },
}));
