import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Car,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Star,
  ChevronRight,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/business" },
  { icon: ClipboardList, label: "Talepler", path: "/business/requests", badge: "5" },
  { icon: Calendar, label: "Randevular", path: "/business/appointments" },
  { icon: MessageSquare, label: "Mesajlar", path: "/business/messages", badge: "3" },
  { icon: Star, label: "Değerlendirmeler", path: "/business/reviews" },
  { icon: Settings, label: "Ayarlar", path: "/business/settings" },
];

const stats = [
  { label: "Bugünkü Talepler", value: "12", icon: ClipboardList, trend: "+3", color: "primary" },
  { label: "Bekleyen Onaylar", value: "5", icon: Clock, color: "warning" },
  { label: "Devam Eden İşler", value: "8", icon: Wrench, color: "accent" },
  { label: "Bu Ay Tamamlanan", value: "47", icon: CheckCircle, trend: "+12%", color: "success" },
];

const recentRequests = [
  { id: "REQ-042", vehicle: "BMW 3 Serisi", issue: "Motor check lambası", status: "pending", time: "10 dk önce" },
  { id: "REQ-041", vehicle: "Mercedes C180", issue: "Fren balata değişimi", status: "approved", time: "25 dk önce" },
  { id: "REQ-040", vehicle: "Audi A4", issue: "Klima gazı dolumu", status: "in_progress", time: "1 saat önce" },
];

export default function BusinessDashboard() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">İşletme Paneli</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 gradient-dark border-r border-sidebar-border transform transition-transform duration-300 md:translate-x-0 md:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden md:flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary shadow-md">
                <Car className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-sidebar-foreground">OtoServis</span>
                <p className="text-xs text-sidebar-foreground/60">İşletme Paneli</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <Badge className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-sidebar-foreground">UM</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">Usta Motor</p>
                  <p className="text-xs text-sidebar-foreground/60">Premium Plan</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-2 justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Hoş geldiniz, Usta Motor 👋
            </h1>
            <p className="text-muted-foreground">
              İşletmenizin bugünkü özeti aşağıda.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        stat.color === "primary" && "bg-primary/10",
                        stat.color === "warning" && "bg-warning/10",
                        stat.color === "accent" && "bg-accent/10",
                        stat.color === "success" && "bg-success/10"
                      )}>
                        <stat.icon className={cn(
                          "h-5 w-5",
                          stat.color === "primary" && "text-primary",
                          stat.color === "warning" && "text-warning",
                          stat.color === "accent" && "text-accent",
                          stat.color === "success" && "text-success"
                        )} />
                      </div>
                      {stat.trend && (
                        <Badge variant="success" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: CheckCircle, label: "Talep Onayla", color: "success" },
                { icon: Calendar, label: "Randevu Ekle", color: "primary" },
                { icon: MessageSquare, label: "Mesaj Gönder", color: "info" },
                { icon: Star, label: "Yorum Yanıtla", color: "accent" },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/30"
                >
                  <action.icon className={cn(
                    "h-6 w-6",
                    action.color === "success" && "text-success",
                    action.color === "primary" && "text-primary",
                    action.color === "info" && "text-info",
                    action.color === "accent" && "text-accent"
                  )} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Son Talepler</CardTitle>
                <Link to="/business/requests">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Tümünü Gör
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRequests.map((request, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.vehicle}</span>
                          <Badge variant={
                            request.status === "pending" ? "warning" :
                            request.status === "approved" ? "info" : "accent"
                          } className="text-xs">
                            {request.status === "pending" ? "Bekliyor" :
                             request.status === "approved" ? "Onaylandı" : "İşlemde"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{request.time}</p>
                        <p className="text-xs font-medium">#{request.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="success" size="sm">✓</Button>
                        <Button variant="outline" size="sm">✕</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
