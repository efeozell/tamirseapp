import ENV from "./env";

// API Configuration
export const API_BASE_URL = ENV.API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login", // ✅ DONE
  SIGNUP: "/auth/signup", // ✅ DONE
  SIGNUP_BUSINESS: "/auth/signup/business", // ✅ DONE
  LOGOUT: "/auth/logout", // ✅ DONE
  ME: "/auth/me", // ✅ DONE

  // Businesses (Shops)
  // TODO: GET /businesses - Get all active businesses with filters
  BUSINESSES: "/businesses",
  // TODO: GET /businesses/:id - Get business by ID
  BUSINESS_BY_ID: (id: string) => `/businesses/${id}`,
  // TODO: GET /businesses/:id/reviews - Get business reviews
  BUSINESS_REVIEWS: (id: string) => `/businesses/${id}/reviews`,
  // TODO: GET /businesses/:id/stats - Get business statistics
  BUSINESS_STATS: (id: string) => `/businesses/${id}/stats`,

  // Service Requests
  // TODO: POST /requests - Create new service request
  CREATE_REQUEST: "/requests",
  // TODO: GET /requests - Get user's requests (filtered by user type)
  REQUESTS: "/requests",
  // TODO: GET /requests/:id - Get request by ID
  REQUEST_BY_ID: (id: string) => `/requests/${id}`,
  // TODO: PATCH /requests/:id/status - Update request status
  UPDATE_REQUEST_STATUS: (id: string) => `/requests/${id}/status`,
  // TODO: PATCH /requests/:id/approve - Business approves request
  APPROVE_REQUEST: (id: string) => `/requests/${id}/approve`,
  // TODO: PATCH /requests/:id/reject - Business rejects request
  REJECT_REQUEST: (id: string) => `/requests/${id}/reject`,
  // TODO: PATCH /requests/:id/complete - Business completes request
  COMPLETE_REQUEST: (id: string) => `/requests/${id}/complete`,
  // TODO: POST /requests/:id/rate - Customer rates request
  RATE_REQUEST: (id: string) => `/requests/${id}/rate`,
  // TODO: POST /requests/:id/pay - Payment for request
  PAY_REQUEST: (id: string) => `/requests/${id}/pay`,
  // TODO: POST /requests/:id/messages - Add message to request
  ADD_MESSAGE: (id: string) => `/requests/${id}/messages`,

  // Notifications
  // TODO: GET /notifications - Get user's notifications
  NOTIFICATIONS: "/notifications",
  // TODO: PATCH /notifications/:id/read - Mark notification as read
  MARK_NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  // TODO: PATCH /notifications/read-all - Mark all notifications as read
  MARK_ALL_NOTIFICATIONS_READ: "/notifications/read-all",

  // User Profile
  // TODO: GET /profile - Get user profile
  PROFILE: "/profile",
  // TODO: PATCH /profile - Update user profile
  UPDATE_PROFILE: "/profile",
  // TODO: PATCH /profile/business - Update business profile
  UPDATE_BUSINESS_PROFILE: "/profile/business",

  // Admin (For future admin panel)
  // TODO: GET /admin/business-requests - Get pending business account requests
  ADMIN_BUSINESS_REQUESTS: "/admin/business-requests",
  // TODO: PATCH /admin/business-requests/:id/approve - Approve business account
  ADMIN_APPROVE_BUSINESS: (id: string) => `/admin/business-requests/${id}/approve`,
  // TODO: PATCH /admin/business-requests/:id/reject - Reject business account
  ADMIN_REJECT_BUSINESS: (id: string) => `/admin/business-requests/${id}/reject`,
  // TODO: GET /admin/users - Get all users
  ADMIN_USERS: "/admin/users",
  // TODO: GET /admin/stats - Get admin dashboard stats
  ADMIN_STATS: "/admin/stats",
} as const;
