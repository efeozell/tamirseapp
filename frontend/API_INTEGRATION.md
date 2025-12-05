# API Entegrasyon Dökümanı

Bu projede mock veriler kaldırılmış ve gerçek API endpoint'leri ile entegrasyon için state management yapısı oluşturulmuştur.

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

// TODO: GET /businesses/:id/stats
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
// TODO: POST /requests
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

// TODO: GET /requests
// Response: ServiceRequest[] (filtered by user type)
// Note: Customer ise customerId'ye göre, Business ise businessId'ye göre filtrele

// TODO: GET /requests/:id
// Response: ServiceRequest (with customer and business relations)

// TODO: PATCH /requests/:id/status
// Body: {
//   status: "approved" | "in_progress" | "completed" | "rejected" | "cancelled",
//   note?: string,
//   price?: number,
//   estimatedCompletionDate?: Date
// }
// Response: ServiceRequest
// Note: Status history'ye yeni status ekle, statusHistory.push({ status, note, timestamp, updatedBy })

// TODO: PATCH /requests/:id/approve
// Body: { price: number, estimatedCompletionDate: Date, businessNotes?: string }
// Response: ServiceRequest
// Note: İşletme onaylar, status="approved", business.activeRequests++

// TODO: PATCH /requests/:id/reject
// Body: { note: string }
// Response: ServiceRequest
// Note: İşletme reddeder, status="rejected"

// TODO: PATCH /requests/:id/complete
// Body: { businessNotes?: string }
// Response: ServiceRequest
// Note: İşletme tamamlar, status="completed", completedAt=now,
//       business.activeRequests--, business.completedRequests++

// TODO: POST /requests/:id/rate
// Body: { rating: number (1-5), review?: string }
// Response: ServiceRequest
// Note: Müşteri değerlendirme yapar, business.averageRating güncellenir

// TODO: POST /requests/:id/pay
// Body: { paymentMethod: string, amount: number }
// Response: ServiceRequest
// Note: Ödeme işlemi, business.totalEarnings += amount

// TODO: POST /requests/:id/messages
// Body: { content: string, attachments?: any[] }
// Response: RequestMessage
// Note: İleride mesajlaşma özelliği için
```

### Notification Endpoints

```typescript
// TODO: GET /notifications
// Response: Notification[]

// TODO: PATCH /notifications/:id/read
// Response: Notification

// TODO: PATCH /notifications/read-all
// Response: { message: string }
```

### User Profile Endpoints

```typescript
// TODO: GET /profile
// Response: User (with business relation if type=business)

// TODO: PATCH /profile
// Body: { name?: string, phone?: string, email?: string }
// Response: User

// TODO: PATCH /profile/business
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

## Sonraki Adımlar

1. Backend API endpoint'lerini implement edin
2. `npm install zustand sonner` komutunu çalıştırın
3. `.env` dosyasını düzenleyin
4. API'yi test edin ve gerekli düzeltmeleri yapın
5. Shop detail ve diğer kalan mock verileri API'ye bağlayın
