import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Car, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  Star,
  Edit,
  Shield,
  HelpCircle,
  FileText,
  Building2
} from "lucide-react";

const menuItems = [
  { icon: Car, label: "Araçlarım", badge: "2", path: "/profile/vehicles" },
  { icon: Bell, label: "Bildirimler", badge: "3", path: "/profile/notifications" },
  { icon: Star, label: "Değerlendirmelerim", path: "/profile/reviews" },
  { icon: Shield, label: "Güvenlik", path: "/profile/security" },
  { icon: HelpCircle, label: "Yardım & Destek", path: "/profile/help" },
  { icon: FileText, label: "Kullanım Şartları", path: "/terms" },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className="h-24 gradient-primary" />
            <CardContent className="pt-0 pb-6 -mt-12">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <Button
                    variant="default"
                    size="icon-sm"
                    className="absolute -bottom-1 -right-1 rounded-full"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-bold">Ahmet Yılmaz</h2>
                  <p className="text-sm text-muted-foreground">ahmet@email.com</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings className="h-4 w-4" />
                  Düzenle
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Toplam Talep</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-success">8</p>
              <p className="text-xs text-muted-foreground">Tamamlanan</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-accent">4.9</p>
              <p className="text-xs text-muted-foreground">Ortalama Puan</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Kayıtlı Araçlar
              </CardTitle>
              <Button variant="ghost" size="sm">+ Ekle</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { brand: "Toyota", model: "Corolla", year: 2019, plate: "34 ABC 123" },
                { brand: "Volkswagen", model: "Golf", year: 2021, plate: "34 XYZ 456" }
              ].map((vehicle, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{vehicle.brand} {vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year} • {vehicle.plate}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <CardContent className="p-2">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="default" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Business CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">İşletme Sahibi misiniz?</h3>
                  <p className="text-sm text-muted-foreground">
                    Dükkanınızı platformumuza ekleyin.
                  </p>
                </div>
                <Link to="/business/auth">
                  <Button variant="hero" size="sm">
                    Başla
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
