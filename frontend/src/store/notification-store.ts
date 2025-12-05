import { create } from "zustand";
import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";

export interface Notification {
  id: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "request_update"
    | "new_message"
    | "request_approved"
    | "request_completed";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  read: boolean; // Alias for compatibility
  requestId?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      // TODO: GET /notifications
      const notifications = await apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS);

      // Parse dates and add read alias
      const parsedNotifications = notifications.map((notif) => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
        read: notif.isRead, // Add alias for compatibility
      }));

      const unreadCount = parsedNotifications.filter((n) => !n.isRead).length;

      set({
        notifications: parsedNotifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      // TODO: PATCH /notifications/:id/read
      await apiClient.patch(API_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId));

      set((state) => {
        const updatedNotifications = state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
        const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;

        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      // TODO: PATCH /notifications/read-all
      await apiClient.patch(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);

      set((state) => ({
        notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },
}));
