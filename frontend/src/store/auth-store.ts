import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";

export type UserType = "customer" | "business" | null;

interface Business {
  id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  services: string;
  workingHours: string;
  description?: string;
  totalEarnings: number;
  completedRequests: number;
  activeRequests: number;
  averageRating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isActive: boolean;
  phone?: string;
  business?: Business;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  signupBusiness: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    businessDetails: {
      businessName: string;
      businessAddress: string;
      businessPhone: string;
      services: string;
      workingHours: string;
      description?: string;
    };
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // POST /auth/login - Cookie-based auth (token in httpOnly cookie)
          const response = await apiClient.post<{ message: string; user?: User }>(API_ENDPOINTS.LOGIN, {
            email,
            password,
          });

          // Token artık cookie'de, kullanıcı bilgisini al
          if (response.user) {
            set({ user: response.user, isAuthenticated: true, isLoading: false });
          } else {
            // Kullanıcı bilgisi yoksa /auth/me'den al
            const user = await apiClient.get<User>(API_ENDPOINTS.ME);
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (data) => {
        set({ isLoading: true });
        try {
          // POST /auth/signup - Customer signup (isActive=true)
          await apiClient.post(API_ENDPOINTS.SIGNUP, data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signupBusiness: async (data) => {
        set({ isLoading: true });
        try {
          // POST /auth/signup/business - Business signup (isActive=false, pending approval)
          await apiClient.post(API_ENDPOINTS.SIGNUP_BUSINESS, data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // TODO: POST /auth/logout
          await apiClient.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          // GET /auth/me - Cookie'deki token ile otomatik kontrol
          const user = await apiClient.get<User>(API_ENDPOINTS.ME);
          set({ user, isAuthenticated: true });
        } catch (error) {
          // Cookie yok veya geçersiz
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist user and isAuthenticated, not isLoading
    }
  )
);
