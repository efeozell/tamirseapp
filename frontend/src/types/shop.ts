export interface Shop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  services: string[];
  estimatedTime: string;
  priceRange: string;
  isOnline: boolean;
  description?: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  images?: string[];
}

export interface ShopReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}
