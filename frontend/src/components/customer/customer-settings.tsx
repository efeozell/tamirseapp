import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { apiClient } from "../../lib/api-client";
import { API_ENDPOINTS } from "../../lib/api-config";
import { toast } from "sonner";
import { User } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface CustomerSettingsProps {
  user: User;
  onLogout: () => void;
  onUpdate: () => Promise<void>;
}

export function CustomerSettings({ user, onLogout, onUpdate }: CustomerSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // User profile state
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await apiClient.patch(API_ENDPOINTS.UPDATE_PROFILE, {
        name: name.trim(),
        phone: phone.trim(),
      });

      toast.success("Profil başarıyla güncellendi");
      await onUpdate(); // Refresh user data
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Profil güncellenemedi");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Müşteri Ayarları</h2>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve soyadınız"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon numaranız"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez</p>
            </div>

            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? "Güncelleniyor..." : "Profili Güncelle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card>
        <CardContent className="pt-6">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
