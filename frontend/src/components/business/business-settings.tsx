import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { API_ENDPOINTS } from "../../lib/api-config";
import { Save, LogOut } from "lucide-react";

interface Business {
  id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  services: string;
  workingHours: string;
  estimatedDeliveryTime?: string;
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business?: Business;
}

interface BusinessSettingsProps {
  user: User;
  onLogout: () => void;
  onUpdate: () => Promise<void>;
}

export function BusinessSettings({ user, onLogout, onUpdate }: BusinessSettingsProps) {
  const business = user.business;
  const [isLoading, setIsLoading] = useState(false);

  // User profile state
  const [userName, setUserName] = useState(user.name);
  const [userPhone, setUserPhone] = useState(user.phone || "");

  // Business profile state
  const [businessName, setBusinessName] = useState(business?.businessName || "");
  const [businessAddress, setBusinessAddress] = useState(business?.businessAddress || "");
  const [businessPhone, setBusinessPhone] = useState(business?.businessPhone || "");
  const [services, setServices] = useState(business?.services || "");
  const [workingHours, setWorkingHours] = useState(business?.workingHours || "");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(business?.estimatedDeliveryTime || "");
  const [description, setDescription] = useState(business?.description || "");

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Update user profile
      await apiClient.patch(API_ENDPOINTS.UPDATE_PROFILE, {
        name: userName,
        phone: userPhone,
      });

      toast.success("Profil bilgileri güncellendi");
      await onUpdate(); // Refresh user data
    } catch (error: any) {
      toast.error(error.message || "Profil güncellenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    setIsLoading(true);
    try {
      // Update business profile
      await apiClient.patch(API_ENDPOINTS.UPDATE_BUSINESS_PROFILE, {
        businessName,
        businessAddress,
        businessPhone,
        services,
        workingHours,
        estimatedDeliveryTime,
        description,
      });

      toast.success("İşletme bilgileri güncellendi");
      await onUpdate(); // Refresh user data
    } catch (error: any) {
      toast.error(error.message || "İşletme bilgileri güncellenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User Profile */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="+90 555 123 4567"
            />
          </div>

          <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Profil Bilgilerini Kaydet
          </Button>
        </div>
      </Card>

      {/* Business Profile */}
      {business && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">İşletme Bilgileri</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">İşletme Adı</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="ProTech Oto Tamir"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Adres</Label>
              <Textarea
                id="businessAddress"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Atatürk Mah. Cumhuriyet Cad. No:123 İstanbul"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone">İşletme Telefonu</Label>
              <Input
                id="businessPhone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+90 212 555 0100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Hizmetler</Label>
              <Input
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="Mekanik Tamir, Kaporta, Boya, Elektrik (virgülle ayırın)"
              />
              <p className="text-xs text-muted-foreground">Hizmetleri virgülle ayırarak yazın</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">Çalışma Saatleri</Label>
              <Input
                id="workingHours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Pazartesi-Cuma: 09:00-18:00, Cumartesi: 09:00-14:00"
              />
              <p className="text-xs text-muted-foreground">Örnek: Hafta içi 09:00-18:00</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryTime">Ortalama Teslim Süresi</Label>
              <Input
                id="estimatedDeliveryTime"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                placeholder="2-3 saat"
              />
              <p className="text-xs text-muted-foreground">Örnek: 2-3 saat, 1-2 gün, 3-5 gün</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="İşletmeniz hakkında kısa bir açıklama..."
                rows={4}
              />
            </div>

            <Button onClick={handleUpdateBusiness} disabled={isLoading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              İşletme Bilgilerini Kaydet
            </Button>
          </div>
        </Card>
      )}

      {/* Logout */}
      <Card className="p-6">
        <Button variant="destructive" onClick={onLogout} className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Çıkış Yap
        </Button>
      </Card>
    </div>
  );
}
