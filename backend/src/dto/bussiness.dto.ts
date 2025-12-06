import { Business } from "../entity/Business.entity";

export class BusinessResponseDTO {
  id?: string;
  name?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  services?: string[];
  estimatedTime?: string;
  priceRange?: string;
  isOnline?: boolean;
  description?: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  images?: string[];

  static fromEntity(business: Business, userLocation?: { lat: number; lng: number }): BusinessResponseDTO {
    return {
      id: business.id,
      name: business.businessName,
      rating: business.averageRating,
      reviewCount: business.completedRequests,
      distance: userLocation ? calculateDistance(userLocation, business.businessAddress) : "Konum kapalı",
      services: business.services.split(",").map((s) => s.trim()),
      estimatedTime: "1-2 gün",
      priceRange: this.getPriceRange(business.totalEarnings),
      isOnline: business.isOnline,
      description: business.description,
      address: business.businessAddress,
      phone: business.businessPhone,
      workingHours: business.workingHours,
      images: [], // TODO: Add images
    };
  }

  private static getPriceRange(earnings: number): string {
    if (earnings < 10000) return "₺";
    if (earnings < 50000) return "₺₺";
    return "₺₺₺";
  }
}

function calculateDistance(userLocation: { lat: number; lng: number }, location: any): string {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(location.lat - userLocation.lat);
  const dLng = toRad(location.lng - userLocation.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(location.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
