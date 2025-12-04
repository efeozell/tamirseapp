// Mock data types and data for the application

export interface Shop {
  id: string;
  name: string;
  description: string;
  services: string[];
  rating: number;
  reviewCount: number;
  distance: number;
  address: string;
  phone: string;
  isOnline: boolean;
  workingHours: string;
  priceRange: string;
  estimatedTime: string;
  image: string;
}

export interface ServiceRequest {
  id: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleKm: number;
  issueDescription: string;
  selectedServices: string[];
  shopId?: string;
  shopName?: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  timeline: TimelineEvent[];
  messages: Message[];
}

export interface TimelineEvent {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  isCompleted: boolean;
}

export interface Message {
  id: string;
  sender: 'shop' | 'customer';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Quote {
  id: string;
  shopId: string;
  shopName: string;
  shopRating: number;
  amount: number;
  estimatedDays: number;
  warranty: string;
  notes: string;
  createdAt: Date;
}

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Usta Motor',
    description: 'Profesyonel motor ve mekanik tamiri',
    services: ['Motor Tamiri', 'Yağ Değişimi', 'Fren Sistemi', 'Elektrik'],
    rating: 4.8,
    reviewCount: 127,
    distance: 1.2,
    address: 'Atatürk Cad. No: 45, Kadıköy',
    phone: '+90 532 123 4567',
    isOnline: true,
    workingHours: '08:00 - 19:00',
    priceRange: '₺₺',
    estimatedTime: '1-2 gün',
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400'
  },
  {
    id: '2',
    name: 'Karakaya Oto',
    description: 'Kaporta ve boya uzmanı',
    services: ['Kaporta', 'Boya', 'Cam Değişimi', 'Döşeme'],
    rating: 4.6,
    reviewCount: 89,
    distance: 2.5,
    address: 'Bağdat Cad. No: 112, Maltepe',
    phone: '+90 533 456 7890',
    isOnline: true,
    workingHours: '09:00 - 18:00',
    priceRange: '₺₺₺',
    estimatedTime: '3-5 gün',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
  },
  {
    id: '3',
    name: 'Anadolu Servis',
    description: 'Komple bakım ve onarım hizmeti',
    services: ['Periyodik Bakım', 'Klima Servisi', 'Lastik', 'Akü'],
    rating: 4.9,
    reviewCount: 234,
    distance: 0.8,
    address: 'İstiklal Mah. Servis Sok. No: 8',
    phone: '+90 534 789 0123',
    isOnline: false,
    workingHours: '08:30 - 20:00',
    priceRange: '₺',
    estimatedTime: 'Aynı gün',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400'
  },
  {
    id: '4',
    name: 'Premium Auto Care',
    description: 'Lüks araç bakım merkezi',
    services: ['Detaylı Yıkama', 'Seramik Kaplama', 'İç Temizlik', 'Motor Yıkama'],
    rating: 4.7,
    reviewCount: 156,
    distance: 3.1,
    address: 'Marina Bulvarı No: 23, Ataşehir',
    phone: '+90 535 012 3456',
    isOnline: true,
    workingHours: '10:00 - 21:00',
    priceRange: '₺₺₺₺',
    estimatedTime: '4-6 saat',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  }
];

export const mockRequests: ServiceRequest[] = [
  {
    id: 'REQ-001',
    vehicleModel: 'Toyota Corolla',
    vehicleYear: 2019,
    vehicleKm: 85000,
    issueDescription: 'Motor check lambası yanıyor, hafif titreşim var.',
    selectedServices: ['Motor Tamiri', 'Periyodik Bakım'],
    shopId: '1',
    shopName: 'Usta Motor',
    status: 'in_progress',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    timeline: [
      { id: '1', status: 'Talep Oluşturuldu', description: 'Talebiniz başarıyla oluşturuldu', timestamp: new Date('2024-01-10 10:30'), isCompleted: true },
      { id: '2', status: 'İşletmeye Ulaştı', description: 'Usta Motor talebinizi inceliyor', timestamp: new Date('2024-01-10 11:00'), isCompleted: true },
      { id: '3', status: 'Onaylandı', description: 'Talebiniz onaylandı', timestamp: new Date('2024-01-11 09:15'), isCompleted: true },
      { id: '4', status: 'İşleme Alındı', description: 'Aracınız servise alındı', timestamp: new Date('2024-01-12 08:00'), isCompleted: true },
      { id: '5', status: 'Tamamlandı', description: 'İşlem tamamlandı, aracınızı teslim alabilirsiniz', timestamp: new Date(), isCompleted: false },
    ],
    messages: [
      { id: '1', sender: 'shop', content: 'Merhaba, aracınızı inceledik. Motor sensöründe arıza tespit ettik.', timestamp: new Date('2024-01-11 14:30') },
      { id: '2', sender: 'shop', content: 'Tahmini maliyet: ₺2,500. Onayınızı bekliyoruz.', timestamp: new Date('2024-01-11 14:32'), attachments: ['fiyat-teklifi.pdf'] },
    ]
  }
];

export const commonIssues = [
  { id: 'engine', label: 'Motor Arızası', icon: 'engine' },
  { id: 'brake', label: 'Fren Sistemi', icon: 'disc' },
  { id: 'body', label: 'Kaporta', icon: 'car' },
  { id: 'paint', label: 'Boya', icon: 'paintbrush' },
  { id: 'electric', label: 'Elektrik', icon: 'zap' },
  { id: 'ac', label: 'Klima', icon: 'snowflake' },
  { id: 'tire', label: 'Lastik', icon: 'circle' },
  { id: 'oil', label: 'Yağ Değişimi', icon: 'droplet' },
];

export const carBrands = [
  'Toyota', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Renault', 
  'Fiat', 'Hyundai', 'Kia', 'Honda', 'Nissan', 'Peugeot', 'Opel', 'Škoda'
];
