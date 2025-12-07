import { create } from "zustand";
import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import { ServiceRequest, RequestStatus } from "../types/request";

interface CreateRequestData {
  shopId: string;
  vehicle: {
    brand: string;
    model: string;
    year: string;
    mileage?: string;
  };
  issueDescription: string;
  selectedIssues: string[];
}

interface RequestState {
  requests: ServiceRequest[];
  selectedRequest: ServiceRequest | null;
  isLoading: boolean;

  // Actions
  fetchRequests: () => Promise<void>;
  fetchRequestById: (id: string) => Promise<void>;
  createRequest: (data: CreateRequestData) => Promise<ServiceRequest>;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string, price?: number) => Promise<void>;
  addMessage: (requestId: string, content: string, attachments?: any[]) => Promise<void>;
  setSelectedRequest: (request: ServiceRequest | null) => void;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      // TODO: GET /requests
      const requests = await apiClient.get<any[]>(API_ENDPOINTS.REQUESTS);

      // Transform backend data to frontend format
      const parsedRequests: ServiceRequest[] = requests.map((req) => ({
        id: req.id,
        requestNumber: req.id.substring(0, 8).toUpperCase(), // İlk 8 karakter UUID'den
        customerId: req.customerId,
        customerName: req.customer?.name || "Kullanıcı",
        customerPhone: req.customer?.phone,
        customerEmail: req.customer?.email,
        businessId: req.businessId || req.business?.id || "",
        businessName: req.business?.businessName || "Atölye",
        shopId: req.businessId || req.business?.id || "",
        shopName: req.business?.businessName || "Atölye",
        vehicle: req.vehicle || { brand: "", model: "", year: "" },
        issueDescription: req.description || "",
        selectedIssues: req.category ? [req.category] : [],
        status: req.status,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
        estimatedPrice: req.price?.toString(),
        actualPrice: req.price?.toString(),
        price: req.price,
        rating: req.rating,
        comment: req.comment,
        review: req.review,
        businessNotes: req.businessNotes,
        messages:
          req.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })) || [],
        timeline:
          req.statusHistory?.map((t: any) => ({
            status: t.status,
            timestamp: new Date(t.timestamp),
            note: t.note,
          })) || [],
      }));

      set({ requests: parsedRequests, isLoading: false });
    } catch (error) {
      console.error("Error fetching requests:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchRequestById: async (id: string) => {
    set({ isLoading: true });
    try {
      // TODO: GET /requests/:id
      const req = await apiClient.get<any>(API_ENDPOINTS.REQUEST_BY_ID(id));

      // Transform backend data to frontend format
      const parsedRequest: ServiceRequest = {
        id: req.id,
        requestNumber: req.id.substring(0, 8).toUpperCase(),
        customerId: req.customerId,
        customerName: req.customer?.name || "Kullanıcı",
        customerPhone: req.customer?.phone,
        customerEmail: req.customer?.email,
        businessId: req.businessId || req.business?.id || "",
        businessName: req.business?.businessName || "Atölye",
        shopId: req.businessId || req.business?.id || "",
        shopName: req.business?.businessName || "Atölye",
        vehicle: req.vehicle || { brand: "", model: "", year: "" },
        issueDescription: req.description || "",
        selectedIssues: req.category ? [req.category] : [],
        status: req.status,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
        estimatedPrice: req.price?.toString(),
        actualPrice: req.price?.toString(),
        price: req.price,
        rating: req.rating,
        comment: req.comment,
        review: req.review,
        businessNotes: req.businessNotes,
        messages:
          req.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })) || [],
        timeline:
          req.statusHistory?.map((t: any) => ({
            status: t.status,
            timestamp: new Date(t.timestamp),
            note: t.note,
          })) || [],
      };

      set({ selectedRequest: parsedRequest, isLoading: false });
    } catch (error) {
      console.error("Error fetching request:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createRequest: async (data: CreateRequestData) => {
    set({ isLoading: true });
    try {
      // TODO: POST /requests
      const req = await apiClient.post<any>(API_ENDPOINTS.CREATE_REQUEST, data);

      // Transform backend data to frontend format
      const parsedRequest: ServiceRequest = {
        id: req.id,
        requestNumber: req.id.substring(0, 8).toUpperCase(),
        customerId: req.customerId,
        customerName: "Kullanıcı",
        businessId: req.businessId || "",
        businessName: "Atölye",
        shopId: req.businessId || "",
        shopName: "Atölye",
        vehicle: req.vehicle || data.vehicle,
        issueDescription: req.description || data.issueDescription,
        selectedIssues: data.selectedIssues || [],
        status: req.status,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
        messages: [],
        timeline: [],
      };

      set((state) => ({
        requests: [...state.requests, parsedRequest],
        isLoading: false,
      }));

      return parsedRequest;
    } catch (error) {
      console.error("Error creating request:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRequestStatus: async (requestId: string, status: RequestStatus, note?: string, price?: number) => {
    try {
      // PATCH /requests/:id/status
      const payload: any = { status, note };
      if (price !== undefined) {
        payload.price = price;
      }
      await apiClient.patch(API_ENDPOINTS.UPDATE_REQUEST_STATUS(requestId), payload);

      // Refetch requests to get updated data
      await get().fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },

  addMessage: async (requestId: string, content: string, attachments?: any[]) => {
    try {
      // TODO: POST /requests/:id/messages
      await apiClient.post(API_ENDPOINTS.ADD_MESSAGE(requestId), { content, attachments });

      // Refetch the request to get updated messages
      await get().fetchRequestById(requestId);
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  },

  setSelectedRequest: (request) => {
    set({ selectedRequest: request });
  },
}));
