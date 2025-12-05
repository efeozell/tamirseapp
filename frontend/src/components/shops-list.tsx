import { useState, useEffect } from "react";
import { ShopCard } from "./shop-card";
import { Shop } from "../types/shop";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useShopStore } from "../store/shop-store";
import { toast } from "sonner";

interface ShopsListProps {
  onQuickRequest: (shop: Shop) => void;
  onViewDetails: (shop: Shop) => void;
}

const allServices = ["Mekanik Tamir", "Kaporta", "Boya", "Elektrik", "Periyodik Bakım"];

export function ShopsList({ onQuickRequest, onViewDetails }: ShopsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { shops, isLoading, fetchShops } = useShopStore();

  // Fetch shops on mount and when filters change
  useEffect(() => {
    fetchShops({
      services: selectedServices.length > 0 ? selectedServices : undefined,
      search: searchQuery || undefined,
    }).catch((error) => {
      console.error("Failed to fetch shops:", error);
      toast.error("Atölyeler yüklenirken hata oluştu");
    });
  }, [selectedServices, fetchShops]);

  // Local search for immediate feedback
  const filteredShops = shops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
  };

  if (isLoading && shops.length === 0) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  // Remove mock data - now using API
  /*
  const mockShops: Shop[] = [
  {
    id: "1",
    name: "ProTech Oto Tamir",
    rating: 4.8,
    reviewCount: 127,
    distance: "2.3 km",
    services: ["Mekanik Tamir", "Elektrik", "Periyodik Bakım"],
    estimatedTime: "2-3 saat",
    priceRange: "₺₺",
    isOnline: true,
  },
  {
    id: "2",
    name: "MasterCar Oto Servis",
    rating: 4.6,
    reviewCount: 89,
    distance: "3.7 km",
    services: ["Kaporta", "Boya", "Mekanik Tamir"],
    estimatedTime: "1-2 gün",
    priceRange: "₺₺₺",
    isOnline: true,
  },
  {
    id: "3",
    name: "HızlıTamir Oto Bakım",
    rating: 4.9,
    reviewCount: 203,
    distance: "1.5 km",
    services: ["Periyodik Bakım", "Elektrik"],
    estimatedTime: "1-2 saat",
    priceRange: "₺",
    isOnline: false,
  },
  {
    id: "4",
    name: "Elit Oto Kaporta",
    rating: 4.7,
    reviewCount: 156,
    distance: "4.2 km",
    services: ["Kaporta", "Boya"],
    estimatedTime: "3-5 gün",
    priceRange: "₺₺₺",
    isOnline: true,
  },
  {
    id: "5",
    name: "Express Oto Mekanik",
    rating: 4.5,
    reviewCount: 98,
    distance: "5.1 km",
    services: ["Mekanik Tamir", "Periyodik Bakım"],
    estimatedTime: "2-4 saat",
    priceRange: "₺₺",
    isOnline: true,
  },
  ...
  ];
  */

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Atölye ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Location indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Konumunuza göre sıralanıyor</span>
        </div>

        {/* Service filters */}
        {showFilters && (
          <div className="p-4 bg-card border border-border rounded-lg space-y-3">
            <p className="text-sm font-medium">Hizmet Filtrele:</p>
            <div className="flex flex-wrap gap-2">
              {allServices.map((service) => (
                <Badge
                  key={service}
                  variant={selectedServices.includes(service) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                  onClick={() => toggleService(service)}>
                  {service}
                </Badge>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedServices([])}>
                Filtreleri Temizle
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">{filteredShops.length} atölye bulundu</div>

      {/* Shop Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredShops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onQuickRequest={() => onQuickRequest(shop)}
            onViewDetails={() => onViewDetails(shop)}
          />
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aramanıza uygun atölye bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
