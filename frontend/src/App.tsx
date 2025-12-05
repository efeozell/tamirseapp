import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

// Auth Components
import { WelcomeScreen } from "./components/auth/welcome-screen";
import { SignupScreen } from "./components/auth/signup-screen";
import { LoginScreen } from "./components/auth/login-screen";

// Customer Components
import { ShopsList } from "./components/shops-list";
import { RequestForm } from "./components/request-form";
import { ShopDetail } from "./components/shop-detail";
import { RequestCard } from "./components/customer/request-card";
import { RequestDetail } from "./components/customer/request-detail";

// Business Components
import { Dashboard } from "./components/business/dashboard";
import { RequestList } from "./components/business/request-list";
import { RequestManagement } from "./components/business/request-management";

// Shared Components
import { Button } from "./components/ui/button";
import { NotificationBadge } from "./components/notifications/notification-badge";

// Icons
import { Wrench, FileText, History, User, Plus, Settings, LayoutDashboard, ClipboardList } from "lucide-react";

// Types
import { ServiceRequest } from "./types/request";
import { Shop } from "./types/shop";

// Stores
import { useAuthStore } from "./store/auth-store";
import { useRequestStore } from "./store/request-store";
import { useNotificationStore } from "./store/notification-store";
import { useShopStore } from "./store/shop-store";

type AuthScreen = "welcome" | "signup" | "login";
type UserType = "customer" | "business" | null;
type CustomerPage = "shops" | "requests" | "history" | "profile";
type BusinessPage = "dashboard" | "requests" | "settings";

export default function App() {
  // Auth State
  const [authScreen, setAuthScreen] = useState<AuthScreen>("welcome");
  const { user, isAuthenticated, login, signup, signupBusiness, logout, checkAuth } = useAuthStore();
  const userType = user?.type || null;

  // Customer State
  const [customerPage, setCustomerPage] = useState<CustomerPage>("shops");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showShopDetail, setShowShopDetail] = useState(false);
  const [showCustomerRequestDetail, setShowCustomerRequestDetail] = useState(false);

  // Business State
  const [businessPage, setBusinessPage] = useState<BusinessPage>("dashboard");
  const [showBusinessRequestManagement, setShowBusinessRequestManagement] = useState(false);

  // Stores
  const {
    requests,
    selectedRequest: selectedCustomerRequest,
    fetchRequests,
    updateRequestStatus,
    addMessage,
    setSelectedRequest: setSelectedCustomerRequest,
  } = useRequestStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { selectedShop, setSelectedShop } = useShopStore();
  const [selectedBusinessRequest, setSelectedBusinessRequest] = useState<ServiceRequest | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth().catch((err) => console.error("Auth check failed:", err));
  }, [checkAuth]);

  // Load data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests().catch((err) => console.error("Failed to fetch requests:", err));
      fetchNotifications().catch((err) => console.error("Failed to fetch notifications:", err));
    }
  }, [isAuthenticated, fetchRequests, fetchNotifications]);

  // Auth Handlers
  const handleLoginSuccess = async (email: string, password: string, type: "customer" | "business") => {
    try {
      await login(email, password);
      setAuthScreen("welcome");
      toast.success("Giriş başarılı!");
    } catch (error: any) {
      toast.error(error.message || "Giriş başarısız oldu");
      throw error;
    }
  };

  const handleSignupSuccess = async (data: any) => {
    try {
      if (data.type === "business" && data.businessDetails) {
        // Business signup
        await signupBusiness(data);
        setAuthScreen("login");
        toast.success("İşletme hesabı talebi gönderildi! Onay sonrası bilgilendirileceksiniz.");
      } else {
        // Customer signup
        await signup(data);
        setAuthScreen("login");
        toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      }
    } catch (error: any) {
      toast.error(error.message || "Kayıt başarısız oldu");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthScreen("welcome");
      // Reset pages
      setCustomerPage("shops");
      setBusinessPage("dashboard");
      toast.info("Çıkış yapıldı");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Customer Handlers
  const handleQuickRequest = (shop: Shop) => {
    setSelectedShop(shop);
    setShowRequestForm(true);
    toast.info(`${shop.name} için talep oluşturuluyor...`);
  };

  const handleViewShopDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setShowShopDetail(true);
  };

  const handleRequestFromDetail = () => {
    setShowShopDetail(false);
    setShowRequestForm(true);
  };

  const handleCloseRequestForm = () => {
    setShowRequestForm(false);
    if (!showShopDetail) {
      setSelectedShop(null);
    }
    toast.success("Talebiniz başarıyla gönderildi!");
  };

  const handleViewCustomerRequest = (request: ServiceRequest) => {
    setSelectedCustomerRequest(request);
    setShowCustomerRequestDetail(true);
  };

  // Business Handlers
  const handleViewBusinessRequest = (request: ServiceRequest) => {
    setSelectedBusinessRequest(request);
    setShowBusinessRequestManagement(true);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, "approved", "Talebiniz onaylandı. En kısa sürede işleme alınacaktır.");
      toast.success("Talep onaylandı");
    } catch (error: any) {
      toast.error(error.message || "Talep onaylanamadı");
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      await updateRequestStatus(requestId, "rejected", reason);
      toast.success("Talep reddedildi");
    } catch (error: any) {
      toast.error(error.message || "Talep reddedilemedi");
    }
  };

  // Notification Handlers
  const handleNotificationClick = (notification: any) => {
    if (notification.requestId) {
      const request = requests.find((r) => r.id === notification.requestId);
      if (request) {
        if (userType === "customer") {
          handleViewCustomerRequest(request);
        } else {
          handleViewBusinessRequest(request);
        }
      }
    }
    markAsRead(notification.id).catch((err) => console.error("Failed to mark as read:", err));
  };

  // Show Auth Screens
  if (!isAuthenticated) {
    if (authScreen === "welcome") {
      return <WelcomeScreen onSignup={() => setAuthScreen("signup")} onLogin={() => setAuthScreen("login")} />;
    }

    if (authScreen === "signup") {
      return (
        <SignupScreen
          onBack={() => setAuthScreen("welcome")}
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthScreen("login")}
        />
      );
    }

    if (authScreen === "login") {
      return (
        <LoginScreen
          onBack={() => setAuthScreen("welcome")}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthScreen("signup")}
          onForgotPassword={() => toast.info("Şifre sıfırlama bağlantısı e-postanıza gönderildi")}
        />
      );
    }
  }

  // Customer App
  if (userType === "customer") {
    const customerNavItems = [
      { id: "shops" as CustomerPage, label: "Atölyeler", icon: Wrench },
      { id: "requests" as CustomerPage, label: "Talepler", icon: FileText },
      { id: "history" as CustomerPage, label: "Geçmiş", icon: History },
      { id: "profile" as CustomerPage, label: "Profil", icon: User },
    ];

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster position="top-center" richColors />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Tamirse</h1>
                  <p className="text-xs text-muted-foreground">Müşteri</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBadge
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={(id: string) => markAsRead(id).catch((err) => console.error(err))}
                  onMarkAllAsRead={() => markAllAsRead().catch((err) => console.error(err))}
                />
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSelectedShop(null);
                    setShowRequestForm(true);
                  }}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Yeni Talep</span>
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {customerPage === "shops" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Yakınınızdaki Atölyeler</h2>
                <p className="text-muted-foreground">En iyi tamir hizmetini bulmak için atölyeleri inceleyin</p>
              </div>
              <ShopsList onQuickRequest={handleQuickRequest} onViewDetails={handleViewShopDetails} />
            </div>
          )}

          {customerPage === "requests" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Talepleriniz</h2>
                <p className="text-muted-foreground">Aktif ve geçmiş taleplerinizi buradan takip edin</p>
              </div>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Talebiniz Yok</h3>
                  <p className="text-muted-foreground mb-6">Henüz bir talep oluşturmadınız</p>
                  <Button onClick={() => setShowRequestForm(true)}>Yeni Talep Oluştur</Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {requests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => handleViewCustomerRequest(request)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {customerPage === "history" && (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Geçmiş İşlemler</h2>
              <p className="text-muted-foreground">Tamamlanmış işlemlerinizi burada görebilirsiniz</p>
            </div>
          )}

          {customerPage === "profile" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Ahmet Yılmaz</h2>
                    <p className="text-muted-foreground">ahmet@example.com</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Kayıtlı Araçlar</p>
                    <p className="font-medium">3 araç</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Toplam Talep</p>
                    <p className="font-medium">{requests.length} adet</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-around">
              {customerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = customerPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCustomerPage(item.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-4 transition-all ${
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground hover:text-foreground hover:scale-105"
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Modals */}
        <RequestForm
          open={showRequestForm}
          onClose={handleCloseRequestForm}
          preSelectedShop={selectedShop || undefined}
        />

        <ShopDetail
          shop={selectedShop}
          open={showShopDetail}
          onClose={() => {
            setShowShopDetail(false);
            setSelectedShop(null);
          }}
          onRequestService={handleRequestFromDetail}
        />

        <RequestDetail
          request={selectedCustomerRequest}
          open={showCustomerRequestDetail}
          onClose={() => {
            setShowCustomerRequestDetail(false);
            setSelectedCustomerRequest(null);
          }}
        />
      </div>
    );
  }

  // Business App
  if (userType === "business") {
    const businessNavItems = [
      { id: "dashboard" as BusinessPage, label: "Dashboard", icon: LayoutDashboard },
      { id: "requests" as BusinessPage, label: "Talepler", icon: ClipboardList },
      { id: "settings" as BusinessPage, label: "Ayarlar", icon: Settings },
    ];

    const dashboardStats = {
      todayRequests: requests.length,
      pendingApproval: requests.filter((r) => r.status === "pending").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      completedToday: requests.filter((r) => r.status === "completed").length,
      rejectedToday: requests.filter((r) => r.status === "rejected").length,
      totalRevenue: "₺12.450",
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster position="top-center" richColors />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Tamirse</h1>
                  <p className="text-xs text-muted-foreground">İşletme Paneli</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBadge
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={(id: string) => markAsRead(id).catch((err) => console.error(err))}
                  onMarkAllAsRead={() => markAllAsRead().catch((err) => console.error(err))}
                />
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {businessPage === "dashboard" && <Dashboard stats={dashboardStats} />}

          {businessPage === "requests" && (
            <RequestList
              requests={requests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onViewDetails={handleViewBusinessRequest}
            />
          )}

          {businessPage === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">İşletme Ayarları</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">İşletme Adı</p>
                    <p className="font-medium">ProTech Oto Tamir</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Çalışma Saatleri</p>
                    <p className="font-medium">Hafta İçi: 09:00 - 18:00</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-around">
              {businessNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = businessPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setBusinessPage(item.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-4 transition-all ${
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground hover:text-foreground hover:scale-105"
                    }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Modals */}
        <RequestManagement
          request={selectedBusinessRequest}
          open={showBusinessRequestManagement}
          onClose={() => {
            setShowBusinessRequestManagement(false);
            setSelectedBusinessRequest(null);
          }}
          onUpdateStatus={updateRequestStatus}
          onSendMessage={addMessage}
        />
      </div>
    );
  }

  return null;
}
