import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ShopCard } from "@/components/shops/ShopCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin,
  Star
} from "lucide-react";
import { mockShops } from "@/lib/mockData";

const serviceFilters = [
  "Tümü",
  "Motor",
  "Kaporta",
  "Boya",
  "Elektrik",
  "Klima",
  "Lastik",
  "Bakım"
];

export default function Shops() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tümü");
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

  const filteredShops = mockShops
    .filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = selectedFilter === "Tümü" ||
        shop.services.some(s => s.toLowerCase().includes(selectedFilter.toLowerCase()));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => sortBy === "distance" ? a.distance - b.distance : b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Dükkan veya hizmet ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 text-base"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 overflow-x-auto scrollbar-thin"
        >
          <div className="flex gap-2 pb-2">
            {serviceFilters.map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-all hover:scale-105"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Sort & Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredShops.length}</span> dükkan bulundu
          </p>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "distance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("distance")}
              className="gap-1"
            >
              <MapPin className="h-4 w-4" />
              Yakınlık
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
              className="gap-1"
            >
              <Star className="h-4 w-4" />
              Puan
            </Button>
          </div>
        </div>

        {/* Shop Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((shop, index) => (
            <ShopCard key={shop.id} shop={shop} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredShops.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sonuç bulunamadı</h3>
            <p className="text-muted-foreground">
              Farklı anahtar kelimeler veya filtreler deneyin.
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
