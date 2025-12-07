const ENV = {
  // Remove trailing slash if exists to prevent double slashes
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, ""),
};

export default ENV;
