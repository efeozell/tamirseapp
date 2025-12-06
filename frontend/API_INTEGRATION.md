# API Entegrasyon Dökümanı

Bu projede mock veriler kaldırılmış ve gerçek API endpoint'leri ile entegrasyon için state management yapısı oluşturulmuştur.

## Database Schema ve Frontend Format Mapping

### 1. User Entity (Database)

**Backend Entity** (`backend/src/entity/User.entity.ts`):

```typescript
{
  id: string (UUID)
  name: string
  email: string (unique)
  password: string (hashed)
  type: "customer" | "business"
  isActive: boolean (default: true)
  phone?: string
  business?: Business[] (OneToMany relation)
}
```

**Frontend Format** (`store/auth-store.ts`):

```typescript
{
  id: string
  name: string
  email: string
  type: "customer" | "business"
  isActive: boolean
  phone?: string
  business?: Business // Frontend'de tek business olarak kullanılıyor
}
```

**Transformation Notes:**

- Password backend'de dönmez (security)
- business relation frontend'de array yerine single object olarak kullanılıyor

---

### 2. Business Entity (Database)

**Backend Entity** (`backend/src/entity/Business.entity.ts`):

```typescript
{
  id: string (UUID)
  businessName: string
  businessAddress: string (text)
  businessPhone: string
  services: string (text)
  workingHours: string
  description?: string (text)
  totalEarnings: number (float, default: 0)
  completedRequests: number (int, default: 0)
  activeRequests: number (int, default: 0)
  averageRating: number (float, default: 0)
  isOnline: boolean (default: true)
  createdAt: Date
  updatedAt: Date
  user: User (ManyToOne relation)
}
```

**Frontend Format** (`types/shop.ts`):

```typescript
{
  id: string
  name: string // businessName
  rating: number // averageRating
  reviewCount: number // completedRequests
  distance: string // Calculated or mock
  services: string[] // services.split(',')
  estimatedTime: string // Mock/calculated
  priceRange: string // Mock/calculated
  isOnline: boolean
  description?: string
  address?: string // businessAddress
  phone?: string // businessPhone
  workingHours?: string
  images?: string[] // Future feature
}
```

**Transformation Logic** (in `shop-store.ts` or controller):

```typescript
// Backend → Frontend
{
  id: business.id,
  name: business.businessName,
  rating: business.averageRating,
  reviewCount: business.completedRequests,
  distance: "2.5 km", // Mock or calculate from user location
  services: business.services.split(',').map(s => s.trim()),
  estimatedTime: "30-45 dk", // Mock or calculate
  priceRange: "₺₺", // Mock or calculate from avgPrice
  isOnline: business.isOnline,
  description: business.description,
  address: business.businessAddress,
  phone: business.businessPhone,
  workingHours: business.workingHours,
  images: []
}
```

---

### 3. ServiceRequest Entity (Database)

**Backend Entity** (`backend/src/entity/ServiceRequest.entity.ts`):

```typescript
{
  id: string (UUID)
  title: string
  description: string (text)
  category: string
  urgency: "low" | "medium" | "high"
  vehicle?: {
    brand: string
    model: string
    year: string
    mileage?: string
  } (simple-json)
  status: "pending" | "approved" | "in_progress" | "completed" | "rejected" | "cancelled"
  price?: number (float)
  businessNotes?: string (text)
  images?: string[] (simple-array)
  estimatedCompletionDate?: Date
  completedAt?: Date
  customer: User (ManyToOne relation)
  customerId: string
  business?: Business (ManyToOne relation)
  businessId?: string
  statusHistory?: Array<{
    status: RequestStatus
    note?: string
    timestamp: Date
    updatedBy: "customer" | "business"
  }> (simple-json)
  rating?: number (float)
  review?: string (text)
  createdAt: Date
  updatedAt: Date
}
```

**Frontend Format** (`types/request.ts`):

```typescript
{
  id: string
  requestNumber: string // Derived from id
  customerId: string
  customerName: string // From customer relation
  shopId: string // businessId
  shopName: string // From business.businessName
  vehicle: {
    brand: string
    model: string
    year: string
    mileage?: string
  }
  issueDescription: string // description
  selectedIssues: string[] // [category] or parsed
  status: "pending" | "approved" | "in_progress" | "completed" | "rejected"
  createdAt: Date
  updatedAt: Date
  estimatedPrice?: string // price.toString()
  actualPrice?: string // price.toString()
  messages: RequestMessage[] // Future feature
  timeline: Array<{
    status: RequestStatus
    timestamp: Date
    note?: string
  }> // From statusHistory
}
```

**Transformation Logic** (in `request-store.ts`):

```typescript
// Backend → Frontend
{
  id: req.id,
  requestNumber: req.id.substring(0, 8).toUpperCase(),
  customerId: req.customerId,
  customerName: req.customer?.name || "Kullanıcı",
  shopId: req.businessId || req.business?.id || "",
  shopName: req.business?.businessName || "Atölye",
  vehicle: req.vehicle || { brand: "", model: "", year: "" },
  issueDescription: req.description || "",
  selectedIssues: req.category ? [req.category] : [],
  status: req.status,
  createdAt: new Date(req.createdAt),
  updatedAt: new Date(req.updatedAt),
  estimatedPrice: req.price?.toString(),
  actualPrice: req.price?.toString(),
  messages: req.messages || [],
  timeline: req.statusHistory?.map(t => ({
    status: t.status,
    timestamp: new Date(t.timestamp),
    note: t.note
  })) || []
}

// Frontend → Backend (Create Request)
{
  businessId: data.shopId,
  title: `${data.vehicle.brand} ${data.vehicle.model} - ${data.selectedIssues[0]}`,
  description: data.issueDescription,
  category: data.selectedIssues[0] || "Genel Tamir",
  urgency: data.urgency || "medium",
  vehicle: {
    brand: data.vehicle.brand,
    model: data.vehicle.model,
    year: data.vehicle.year,
    mileage: data.vehicle.mileage
  },
  status: "pending",
  customerId: userId // From auth middleware
}
```

---

### 4. Notification Entity (Future)

**Planned Backend Entity**:

```typescript
{
  id: string (UUID)
  userId: string
  type: "request_update" | "payment" | "message" | "system"
  title: string
  message: string
  read: boolean (default: false)
  actionUrl?: string
  createdAt: Date
}
```

**Frontend Format** (`store/notification-store.ts`):

```typescript
{
  id: string
  type: "request_update" | "payment" | "message" | "system"
  title: string
  message: string
  read: boolean
  timestamp: Date // createdAt
  actionUrl?: string
}
```

---

### Key Transformation Rules

1. **Date Fields**: Backend'den string olarak gelen tarihler frontend'de `new Date()` ile parse edilir
2. **Relations**: Backend'de entity relation'ları frontend'de flatten edilir (business.businessName → shopName)
3. **Arrays**: Backend'de comma-separated string'ler frontend'de array'e çevrilir (services)
4. **Derived Fields**: Frontend'de backend'de olmayan alanlar türetilir (requestNumber, distance, estimatedTime)
5. **Optional Fields**: Backend'de nullable olan alanlar frontend'de optional (?) olarak işaretlenir
6. **Password**: Backend'de saklanır ama hiçbir zaman frontend'e dönmez

## Yapılan Değişiklikler

### 1. State Management Yapısı (Zustand)

Aşağıdaki store'lar oluşturuldu:

- **auth-store.ts**: Kullanıcı authentication işlemleri
- **shop-store.ts**: Atölye (shop) verileri ve işlemleri
- **request-store.ts**: Servis talepleri (requests) yönetimi
- **notification-store.ts**: Bildirimler

### 2. API Client

- **api-client.ts**: HTTP istekleri için genel client (GET, POST, PATCH, PUT, DELETE)
- **api-config.ts**: API endpoint'leri ve configuration

### 3. Güncellenen Componentler

#### Auth Components

- `login-screen.tsx`: API ile login entegrasyonu eklendi
- `signup-screen.tsx`: API ile signup entegrasyonu eklendi

#### Customer Components

- `shops-list.tsx`: Mock veriler kaldırıldı, API'den veri çekme eklendi
- `shop-detail.tsx`: Shop detayları API'den çekilecek şekilde güncellendi
- `request-form.tsx`: Form submit API'ye POST request atacak şekilde güncellendi

#### Main App

- `App.tsx`: Mock data hook kaldırıldı, store'lar entegre edildi

## Gerekli TODO Endpoint'ler

Tüm endpoint'ler `api-config.ts` dosyasında TODO olarak işaretlenmiştir. Backend ekibinin implement etmesi gereken endpoint'ler:

### Authentication Endpoints

```typescript
// ✅ TAMAMLANDI - POST /auth/login
// Body: { email: string, password: string }
// Response: { message: string, user: User }
// Note: isActive=false olan business hesapları login yapamaz (403 error)

// ✅ TAMAMLANDI - POST /auth/signup
// Body: { name: string, email: string, password: string, phone: string }
// Response: { message: string }
// Note: Customer hesapları isActive=true olarak oluşturulur

// ✅ TAMAMLANDI - POST /auth/signup/business
// Body: {
//   name: string,
//   email: string,
//   password: string,
//   phone: string,
//   businessDetails: {
//     businessName: string,
//     businessAddress: string,
//     businessPhone: string,
//     services: string,
//     workingHours: string,
//     description?: string
//   }
// }
// Response: { message: "Business account request submitted successfully. You will be notified once approved." }
// Note: Business hesapları isActive=false olarak oluşturulur, admin onayı bekler

// ✅ TAMAMLANDI - POST /auth/logout
// Response: { message: string }

// ✅ TAMAMLANDI - GET /auth/me
// Response: User (with business relation if type=business)
```

### Business (Shop) Endpoints

```typescript
// TODO: GET /businesses ✅ TAMAMLANDI
// Query Params: services?: string[], search?: string, limit?: number, offset?: number
// Response: Business[] (only isActive=true businesses)
// Note: Her business için user bilgisi de dönülmeli (relation)

// TODO: GET /businesses/:id ✅ TAMAMLANDI
// Response: Business (with user relation)

// TODO: GET /businesses/:id/reviews ✅ TAMAMLANDI
// Response: ServiceRequest[] (completed requests with rating and review)
// Note: Bu endpoint tamamlanmış ve değerlendirilmiş servisleri döndürür

// TODO: GET /businesses/:id/stats  ✅ TAMAMLANDI
// Response: {
//   totalEarnings: number,
//   completedRequests: number,
//   activeRequests: number,
//   averageRating: number,
//   monthlyRevenue: number,
//   weeklyRevenue: number
// }
// Note: Dashboard için gerekli istatistikler
```

### Service Request Endpoints

```typescript
// TODO: POST /requests ✅ TAMAMLANDI
// Body: {
//   businessId: string,
//   title: string,
//   description: string,
//   category: string,
//   urgency: "low" | "medium" | "high",
//   images?: string[]
// }
// Response: ServiceRequest
// Note: Müşteri tarafından oluşturulur, status="pending", customerId otomatik eklenir

// TODO: GET /requests ✅ TAMAMLANDI
// Response: ServiceRequest[] (filtered by user type)
// Note: Customer ise customerId'ye göre, Business ise businessId'ye göre filtrele

// TODO: GET /requests/:id  ✅ TAMAMLANDI
// Response: ServiceRequest (with customer and business relations)

// TODO: PATCH /requests/:id/status  ✅ TAMAMLANDI
// Body: {
//   status: "approved" | "in_progress" | "completed" | "rejected" | "cancelled",
//   note?: string,
//   price?: number,
//   estimatedCompletionDate?: Date
// }
// Response: ServiceRequest
// Note: Status history'ye yeni status ekle, statusHistory.push({ status, note, timestamp, updatedBy })

// TODO: PATCH /requests/:id/approve ✅ TAMAMLANDI
// Body: { price: number, estimatedCompletionDate: Date, businessNotes?: string }
// Response: ServiceRequest
// Note: İşletme onaylar, status="approved", business.activeRequests++

// TODO: PATCH /requests/:id/reject ✅ TAMAMLANDI
// Body: { note: string }
// Response: ServiceRequest
// Note: İşletme reddeder, status="rejected"

// TODO: PATCH /requests/:id/complete ✅ TAMAMLANDI
// Body: { businessNotes?: string }
// Response: ServiceRequest
// Note: İşletme tamamlar, status="completed", completedAt=now,
//       business.activeRequests--, business.completedRequests++

// TODO: POST /requests/:id/rate  ✅ TAMAMLANDI
// Body: { rating: number (1-5), review?: string }
// Response: ServiceRequest
// Note: Müşteri değerlendirme yapar, business.averageRating güncellenir

// TODO: POST /requests/:id/pay   ✅ TAMAMLANDI
// Body: { paymentMethod: string, amount: number }
// Response: ServiceRequest
// Note: Ödeme işlemi, business.totalEarnings += amount

// TODO: POST /requests/:id/messages ✅ TAMAMLANDI
// Body: { content: string, attachments?: any[] }
// Response: RequestMessage
// Note: İleride mesajlaşma özelliği için
```

### Notification Endpoints

```typescript
// TODO: GET /notifications ✅ TAMAMLANDI
// Response: Notification[]

// TODO: PATCH /notifications/:id/read ✅ TAMAMLANDI
// Response: Notification

// TODO: PATCH /notifications/read-all  ✅ TAMAMLANDI
// Response: { message: string }
```

### User Profile Endpoints

```typescript
// TODO: GET /profile ✅ TAMAMLANDI
// Response: User (with business relation if type=business)

// TODO: PATCH /profile ✅ TAMAMLANDI
// Body: { name?: string, phone?: string, email?: string }
// Response: User

// TODO: PATCH /profile/business ✅ TAMAMLANDI
// Body: Partial<Business> (businessName, businessAddress, businessPhone, services, workingHours, description)
// Response: User (with updated business)
// Note: Sadece type=business olan kullanıcılar için
```

### Admin Endpoints (İleride Admin Panel İçin)

```typescript
// TODO: GET /admin/business-requests
// Response: User[] (type=business && isActive=false)
// Note: Onay bekleyen işletme hesapları

// TODO: PATCH /admin/business-requests/:id/approve
// Response: User
// Note: İşletme hesabını aktif et (isActive=true)

// TODO: PATCH /admin/business-requests/:id/reject
// Body: { reason: string }
// Response: { message: string }
// Note: İşletme hesabı talebini reddet, notification gönder

// TODO: GET /admin/users
// Query Params: type?: 'customer' | 'business', isActive?: boolean
// Response: User[]

// TODO: GET /admin/stats
// Response: {
//   totalUsers: number,
//   totalBusinesses: number,
//   activeBusinesses: number,
//   pendingBusinesses: number,
//   totalRequests: number,
//   completedRequests: number,
//   totalRevenue: number
// }
```

## Type Definitions

Tüm type'lar aşağıdaki dosyalarda tanımlanmıştır:

- `types/request.ts`: ServiceRequest, RequestStatus, RequestMessage
- `types/shop.ts`: Shop, ShopReview
- `store/auth-store.ts`: User, UserType
- `store/notification-store.ts`: Notification

## Kurulum

Projeyi çalıştırmadan önce gerekli paketleri yükleyin:

```bash
npm install zustand sonner
```

## Environment Variables

`.env` dosyasında API base URL'ini ayarlayın:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Kullanım Örnekleri

### Store Kullanımı

```tsx
import { useAuthStore } from "./store/auth-store";
import { useShopStore } from "./store/shop-store";

function MyComponent() {
  const { login, user, isAuthenticated } = useAuthStore();
  const { shops, fetchShops, isLoading } = useShopStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchShops();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    await login("email@example.com", "password", "customer");
  };

  return <div>{/* Component JSX */}</div>;
}
```

### API Error Handling

Tüm API çağrıları try-catch ile handle edilir ve kullanıcıya toast mesajı gösterilir:

```tsx
try {
  await createRequest(data);
  toast.success("İşlem başarılı");
} catch (error: any) {
  toast.error(error.message || "Bir hata oluştu");
}
```

## Notlar

1. **TypeScript Hatalar**: Projeye `zustand` paketi ve `@types/react` eklenmesi gerekiyor. Bunları yükledikten sonra TypeScript hataları düzelecektir.

2. **Mock Veriler**: Bazı componentlerde minimal mock veriler geçici olarak bırakıldı (shop-detail gibi). Bunlar API entegrasyonu tamamlandığında tamamen kaldırılabilir.

3. **Token Management**: JWT token'lar localStorage'da saklanıyor ve her API isteğinde Authorization header'ına ekleniyor.

4. **Date Parsing**: API'den gelen date string'leri Date objelerine dönüştürülüyor (store'larda).

5. **Zustand Persist**: Auth store persist middleware kullanıyor, böylece kullanıcı bilgileri sayfa yenilemesinde korunuyor.

## Field Mapping Özeti

| Backend Field           | Frontend Field                  | Transformation                    |
| ----------------------- | ------------------------------- | --------------------------------- |
| **User**                |                                 |                                   |
| `id`                    | `id`                            | Direct                            |
| `name`                  | `name`                          | Direct                            |
| `email`                 | `email`                         | Direct                            |
| `type`                  | `type`                          | Direct                            |
| `isActive`              | `isActive`                      | Direct                            |
| `phone`                 | `phone`                         | Direct                            |
| `password`              | -                               | **Never sent to frontend**        |
| **Business**            |                                 |                                   |
| `id`                    | `id`                            | Direct                            |
| `businessName`          | `name`                          | Renamed                           |
| `businessAddress`       | `address`                       | Renamed                           |
| `businessPhone`         | `phone`                         | Renamed                           |
| `services` (string)     | `services` (array)              | `split(',').map(trim)`            |
| `workingHours`          | `workingHours`                  | Direct                            |
| `description`           | `description`                   | Direct                            |
| `averageRating`         | `rating`                        | Renamed                           |
| `completedRequests`     | `reviewCount`                   | Renamed                           |
| `isOnline`              | `isOnline`                      | Direct                            |
| -                       | `distance`                      | **Calculated/Mock**               |
| -                       | `estimatedTime`                 | **Calculated/Mock**               |
| -                       | `priceRange`                    | **Calculated/Mock**               |
| **ServiceRequest**      |                                 |                                   |
| `id`                    | `id`                            | Direct                            |
| -                       | `requestNumber`                 | `id.substring(0,8).toUpperCase()` |
| `customerId`            | `customerId`                    | Direct                            |
| `customer.name`         | `customerName`                  | From relation                     |
| `businessId`            | `shopId`                        | Renamed                           |
| `business.businessName` | `shopName`                      | From relation                     |
| `title`                 | -                               | Backend only                      |
| `description`           | `issueDescription`              | Renamed                           |
| `category`              | `selectedIssues[0]`             | Array conversion                  |
| `vehicle`               | `vehicle`                       | Direct (JSON)                     |
| `status`                | `status`                        | Direct                            |
| `price`                 | `estimatedPrice`, `actualPrice` | `toString()`                      |
| `statusHistory`         | `timeline`                      | Date parse                        |
| -                       | `messages`                      | **Future feature**                |

## Data Flow Diagrams

### Create Request Flow

```
Frontend (request-form.tsx)
  ↓ Submit form
  {
    shopId: string,
    vehicle: { brand, model, year, mileage },
    issueDescription: string,
    selectedIssues: string[]
  }
  ↓
request-store.ts (createRequest)
  ↓ POST /requests
  {
    businessId: shopId,
    title: `${brand} ${model} - ${issue}`,
    description: issueDescription + vehicle details,
    category: selectedIssues[0],
    vehicle: { brand, model, year, mileage },
    urgency: "medium",
    status: "pending"
  }
  ↓
Backend (service.request.controller.ts)
  ↓ Save to database
ServiceRequest Entity
  ↓ Return created request
  {
    id, title, description, category, urgency,
    vehicle, status, customerId, businessId,
    createdAt, updatedAt
  }
  ↓
request-store.ts (transform)
  ↓ Transform to frontend format
  {
    id, requestNumber, customerId, customerName,
    shopId, shopName, vehicle, issueDescription,
    selectedIssues, status, createdAt, updatedAt,
    messages: [], timeline: []
  }
  ↓
Frontend (request-card.tsx)
  Display request card
```

### Fetch Shops Flow

```
Frontend (App.tsx / shops-list.tsx)
  ↓ Component mount
shop-store.ts (fetchShops)
  ↓ GET /businesses
Backend (business.controller.ts)
  ↓ Query database
  SELECT business.*, user.name, user.email, user.phone
  FROM business
  JOIN user ON business.userId = user.id
  WHERE user.isActive = true
  ↓ Return businesses
  [
    {
      id, businessName, businessAddress, businessPhone,
      services, workingHours, description, averageRating,
      completedRequests, isOnline, user: { name, email, phone }
    }
  ]
  ↓
shop-store.ts (transform)
  ↓ Transform to Shop[]
  [
    {
      id, name: businessName, rating: averageRating,
      reviewCount: completedRequests, services: services.split(','),
      address: businessAddress, phone: businessPhone,
      workingHours, description, isOnline,
      distance: "2.5 km", estimatedTime: "30-45 dk", priceRange: "₺₺"
    }
  ]
  ↓
Frontend (shops-list.tsx)
  Map and render shop cards
```

## Sonraki Adımlar

1. Backend API endpoint'lerini implement edin
2. `npm install zustand sonner` komutunu çalıştırın
3. `.env` dosyasını düzenleyin
4. API'yi test edin ve gerekli düzeltmeleri yapın
5. Shop detail ve diğer kalan mock verileri API'ye bağlayın
6. Transformation logic'i backend controller'larda da uygulayabilirsiniz (recommended)
