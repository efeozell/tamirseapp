import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Shops from "./pages/Shops";
import ShopDetail from "./pages/ShopDetail";
import NewRequest from "./pages/NewRequest";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import Profile from "./pages/Profile";
import BusinessDashboard from "./pages/business/Dashboard";
import BusinessAuth from "./pages/business/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/shops/:id" element={<ShopDetail />} />
          <Route path="/request/new" element={<NewRequest />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Business Routes */}
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/auth" element={<BusinessAuth />} />
          <Route path="/business/requests" element={<BusinessDashboard />} />
          <Route path="/business/appointments" element={<BusinessDashboard />} />
          <Route path="/business/messages" element={<BusinessDashboard />} />
          <Route path="/business/reviews" element={<BusinessDashboard />} />
          <Route path="/business/settings" element={<BusinessDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
