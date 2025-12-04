import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone,
  Navigation,
  Zap,
  ChevronLeft,
  Calendar,
  DollarSign,
  Shield,
  MessageCircle,
  Share2
} from "lucide-react";
import { mockShops } from "@/lib/mockData";

const serviceIcons: Record<string, string> = {
  'Motor Tamiri': '🔧',
  'Yağ Değişimi': '🛢️',
  'Fren Sistemi': '⚡',
  'Elektrik': '💡',
  'Kaporta': '🚗',
  'Boya': '🎨',
  'Cam Değişimi': '🪟',
  'Döşeme': '🪑',
  'Periyodik Bakım': '🔄',
  'Klima Servisi': '❄️',
  'Lastik': '⭕',
  'Akü': '🔋',
  'Detaylı Yıkama': '🚿',
  'Seramik Kaplama': '✨',
  'İç Temizlik': '🧹',
  'Motor Yıkama': '💧',
};

export default function ShopDetail() {
  const { id } = useParams();
  const shop = mockShops.find(s => s.id === id);

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dükkan bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-8">
      <Header />

      {/* Hero Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <Link to="/shops" className="absolute top-4 left-4">
          <Button variant="glass" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>

        {/* Share Button */}
        <Button variant="glass" size="icon" className="absolute top-4 right-4 rounded-full">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <main className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Shop Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{shop.name}</h1>
                    <Badge variant={shop.isOnline ? "status" : "status-offline"}>
                      {shop.isOnline ? "Aktif" : "Meşgul"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{shop.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-xl font-bold">{shop.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shop.reviewCount} değerlendirme
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm">{shop.distance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm">{shop.workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-sm">{shop.priceRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm">{shop.estimatedTime}</span>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{shop.address}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Highlight Boxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Tahmini Süre</p>
              <p className="text-lg font-bold text-primary">{shop.estimatedTime}</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-accent/10 border-accent/20">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Fiyat Aralığı</p>
              <p className="text-lg font-bold text-accent">{shop.priceRange}</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-success/10 border-success/20">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm font-medium">Garanti</p>
              <p className="text-lg font-bold text-success">6 Ay</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Sunulan Hizmetler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {shop.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                  >
                    <span className="text-2xl">{serviceIcons[service] || '🔧'}</span>
                    <span className="font-medium text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">İletişim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{shop.phone}</span>
                </div>
                <Button variant="ghost" size="sm">Ara</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm">{shop.address}</span>
                </div>
                <Button variant="ghost" size="sm">Harita</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Değerlendirmeler</CardTitle>
              <Button variant="ghost" size="sm">Tümünü Gör</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold">AK</span>
                        </div>
                        <span className="font-medium text-sm">Ahmet K.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3 w-3 ${j < 5 ? "fill-accent text-accent" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Çok memnun kaldım. Hızlı ve kaliteli hizmet. Kesinlikle tavsiye ederim.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-20 md:bottom-4 left-0 right-0 px-4 z-40">
        <div className="container mx-auto max-w-lg">
          <div className="flex gap-3 p-4 glass rounded-2xl shadow-xl border border-border/50">
            <Button variant="outline" className="flex-1 gap-2">
              <MessageCircle className="h-5 w-5" />
              Mesaj
            </Button>
            <Link to={`/request/new?shopId=${shop.id}`} className="flex-1">
              <Button variant="hero-accent" className="w-full gap-2">
                <Zap className="h-5 w-5" />
                Talep Gönder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
