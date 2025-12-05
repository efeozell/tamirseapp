import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MapPin, Clock, Wrench, Paintbrush, Settings, Zap } from "lucide-react";
import { Shop } from "../types/shop";

interface ShopCardProps {
  shop: Shop;
  onQuickRequest?: () => void;
  onViewDetails?: () => void;
}

const serviceIcons: { [key: string]: any } = {
  "Mekanik Tamir": Wrench,
  Kaporta: Settings,
  Boya: Paintbrush,
  Elektrik: Zap,
  "Periyodik Bakım": Clock,
};

export function ShopCard({ shop, onQuickRequest, onViewDetails }: ShopCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card group">
      <div className="p-5">
        {/* Header with name and status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {shop.name}
              </h3>
              {shop.isOnline && (
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" title="Çevrimiçi" />
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(shop.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {shop.rating} ({shop.reviewCount} değerlendirme)
              </span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {shop.services.map((service) => {
            const Icon = serviceIcons[service] || Wrench;
            return (
              <Badge key={service} variant="secondary" className="flex items-center gap-1 px-2.5 py-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">{service}</span>
              </Badge>
            );
          })}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Mesafe</span>
            <span className="text-sm font-medium">{shop.distance}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Tahmini Süre</span>
            <span className="text-sm font-medium">{shop.estimatedTime}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-lg mb-1">💰</span>
            <span className="text-xs text-muted-foreground">Fiyat</span>
            <span className="text-sm font-medium">{shop.priceRange}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={onViewDetails}>
            Detaylar
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
            onClick={onQuickRequest}>
            Hızlı Talep
          </Button>
        </div>
      </div>
    </Card>
  );
}
