import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Wrench,
  Paintbrush,
  Settings,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { Shop } from "../types/shop";
import { useShopStore } from "../store/shop-store";
import { toast } from "sonner";

interface ShopDetailProps {
  shop: Shop | null;
  open: boolean;
  onClose: () => void;
  onRequestService: () => void;
}

const serviceIcons: { [key: string]: any } = {
  "Mekanik Tamir": Wrench,
  Kaporta: Settings,
  Boya: Paintbrush,
  Elektrik: Zap,
  "Periyodik Bakım": Clock,
};

const getShopDetails = (shop: Shop | null) => {
  if (!shop) return null;

  // Parse working hours from backend format
  const parseWorkingHours = (hoursString?: string) => {
    if (!hoursString) {
      return {
        weekdays: "Bilgi yok",
        saturday: "Bilgi yok",
        sunday: "Kapalı",
      };
    }

    // Try to parse if it's JSON format
    try {
      const parsed = JSON.parse(hoursString);
      return parsed;
    } catch {
      // If it's plain text, return as is
      return {
        weekdays: hoursString,
        saturday: hoursString,
        sunday: "Kapalı",
      };
    }
  };

  // Parse services string to array if needed
  const servicesArray =
    typeof shop.services === "string"
      ? shop.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(shop.services)
      ? shop.services
      : [];

  return {
    ...shop,
    services: servicesArray,
    phone: shop.phone || "Bilgi yok",
    email: shop.email || "Bilgi yok",
    address: shop.address || "Bilgi yok",
    workingHours: parseWorkingHours(shop.workingHours),
    features: ["Profesyonel Hizmet", "Garantili İşçilik"],
    serviceDetails: [
      { name: "Mekanik Tamir", description: "Motor ve mekanik parça tamiri" },
      { name: "Kaporta", description: "Kaporta ve gövde onarımı" },
      { name: "Boya", description: "Profesyonel araç boyama hizmeti" },
      { name: "Elektrik", description: "Elektrik sistemleri ve elektronik onarım" },
      { name: "Periyodik Bakım", description: "Düzenli araç bakım hizmeti" },
    ],
  };
};

export function ShopDetail({ shop, open, onClose, onRequestService }: ShopDetailProps) {
  const { fetchShopById, shopReviews, fetchShopReviews } = useShopStore();

  // Fetch detailed shop data when dialog opens
  useEffect(() => {
    if (shop && open) {
      // Fetch detailed shop information
      fetchShopById(shop.id).catch((err) => {
        console.error("Failed to fetch shop details:", err);
        toast.error("Atölye detayları yüklenemedi");
      });

      // Fetch shop reviews (suppress 404 errors as endpoint may not exist)
      fetchShopReviews(shop.id).catch((err) => {
        // Silently handle 404 errors for reviews endpoint
        if (err?.response?.status !== 404) {
          console.error("Failed to fetch shop reviews:", err);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop?.id, open]); // Sadece shop.id ve open değişince çalışsın

  const details = getShopDetails(shop);

  if (!details) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{details.name} - İşletme Detayları</DialogTitle>
          <DialogDescription>
            {details.name} işletmesinin detaylı bilgileri, çalışma saatleri, hizmetler ve iletişim bilgileri
          </DialogDescription>
        </DialogHeader>

        {/* Header with Cover */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-primary/70 p-6 flex items-end">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">{details.name}</h2>
              {details.isOnline && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-300 rounded-full">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Çevrimiçi</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(details.rating) ? "fill-amber-300 text-amber-300" : "text-white/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {details.rating} • {details.reviewCount} değerlendirme
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Mesafe</p>
              <p className="font-semibold text-blue-900">{details.distance}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Clock className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Tahmini Süre</p>
              <p className="font-semibold text-green-900">{details.estimatedTime}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <span className="text-2xl mb-2 block">💰</span>
              <p className="text-xs text-muted-foreground">Fiyat Aralığı</p>
              <p className="font-semibold text-amber-900">{details.priceRange}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Sunulan Hizmetler
            </h3>
            <div className="space-y-3">
              {details.serviceDetails
                .filter((service) => details.services.includes(service.name))
                .map((service) => {
                  const Icon = serviceIcons[service.name] || Wrench;
                  return (
                    <div
                      key={service.name}
                      className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <p className="text-sm font-medium text-primary">{service.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Özellikler
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {details.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact & Hours */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">İletişim</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${details.phone}`} className="hover:text-primary">
                    {details.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${details.email}`} className="hover:text-primary">
                    {details.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{details.address}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Çalışma Saatleri
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hafta İçi</span>
                  <span className="font-medium">{details.workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cumartesi</span>
                  <span className="font-medium">{details.workingHours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pazar</span>
                  <span className="font-medium text-destructive">{details.workingHours.sunday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button - Sticky at bottom */}
          <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-background via-background to-transparent">
            <Button size="lg" className="w-full" onClick={onRequestService}>
              TALEP GÖNDER
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
