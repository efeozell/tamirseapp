import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Clock, 
  Zap,
  ChevronRight,
  Navigation
} from "lucide-react";
import { Shop } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ShopCardProps {
  shop: Shop;
  index?: number;
}

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

export function ShopCard({ shop, index = 0 }: ShopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden hover:border-primary/30">
        <div className="relative h-40 overflow-hidden">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={shop.isOnline ? "status" : "status-offline"} className="gap-1">
              <span className={cn(
                "h-2 w-2 rounded-full",
                shop.isOnline ? "bg-success-foreground" : "bg-muted-foreground"
              )} />
              {shop.isOnline ? "Aktif" : "Meşgul"}
            </Badge>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="gap-1 bg-background/90">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {shop.rating}
            </Badge>
          </div>

          {/* Shop Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-primary-foreground">
              {shop.name}
            </h3>
            <p className="text-sm text-primary-foreground/80 line-clamp-1">
              {shop.description}
            </p>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Services */}
          <div className="flex flex-wrap gap-1.5">
            {shop.services.slice(0, 4).map((service) => (
              <Badge 
                key={service} 
                variant="muted"
                className="gap-1 text-xs"
              >
                <span>{serviceIcons[service] || '🔧'}</span>
                {service}
              </Badge>
            ))}
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{shop.distance} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{shop.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{shop.priceRange}</span>
            </div>
          </div>

          {/* Review Count */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>{shop.reviewCount} değerlendirme</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <Navigation className="h-4 w-4" />
              Harita
            </Button>
            <Link to={`/shops/${shop.id}`} className="flex-1">
              <Button variant="hero" size="sm" className="w-full gap-1">
                <Zap className="h-4 w-4" />
                Detaylar
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
