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
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => Promise<void>;
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
      const requests = await apiClient.get<ServiceRequest[]>(API_ENDPOINTS.REQUESTS);

      // Convert date strings to Date objects
      const parsedRequests = requests.map((request) => ({
        ...request,
        createdAt: new Date(request.createdAt),
        updatedAt: new Date(request.updatedAt),
        messages: request.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        timeline: request.timeline.map((t) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
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
      const request = await apiClient.get<ServiceRequest>(API_ENDPOINTS.REQUEST_BY_ID(id));

      // Convert date strings to Date objects
      const parsedRequest = {
        ...request,
        createdAt: new Date(request.createdAt),
        updatedAt: new Date(request.updatedAt),
        messages: request.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        timeline: request.timeline.map((t) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
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
      const request = await apiClient.post<ServiceRequest>(API_ENDPOINTS.CREATE_REQUEST, data);

      // Parse dates
      const parsedRequest = {
        ...request,
        createdAt: new Date(request.createdAt),
        updatedAt: new Date(request.updatedAt),
        messages: request.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        timeline: request.timeline.map((t) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
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

  updateRequestStatus: async (requestId: string, status: RequestStatus, note?: string) => {
    try {
      // TODO: PATCH /requests/:id/status
      await apiClient.patch(API_ENDPOINTS.UPDATE_REQUEST_STATUS(requestId), { status, note });

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
