import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Store, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface SignupScreenProps {
  onBack: () => void;
  onSuccess: (data: { name: string; email: string; password: string; type: "customer" | "business" }) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onBack, onSuccess, onSwitchToLogin }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    services: "",
    workingHours: "",
    description: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<"customer" | "business">("customer");
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad gereklidir";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta girin";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gereklidir";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    // Business form validation
    if (showBusinessForm) {
      if (!businessData.businessName.trim()) {
        newErrors.businessName = "İşletme adı gereklidir";
      }
      if (!businessData.businessAddress.trim()) {
        newErrors.businessAddress = "İşletme adresi gereklidir";
      }
      if (!businessData.businessPhone.trim()) {
        newErrors.businessPhone = "İşletme telefonu gereklidir";
      }
      if (!businessData.services.trim()) {
        newErrors.services = "Sunduğunuz hizmetleri belirtiniz";
      }
      if (!businessData.workingHours.trim()) {
        newErrors.workingHours = "Çalışma saatleri gereklidir";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (showBusinessForm) {
          // Business signup - will set isActive: false
          await onSuccess({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            type: "business",
            businessDetails: businessData,
          } as any);

          toast.success("İşletme hesabı talebi gönderildi! Onay sonrası bilgilendirileceksiniz.");
        } else {
          // Customer signup - will be active immediately
          await onSuccess({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            type: "customer",
          });
        }
      } catch (error) {
        // Error is already handled in parent
      }
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.info(`${provider} ile kayıt işlemi başlatılıyor...`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-card">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Kayıt Ol</h1>
            <p className="text-muted-foreground">Hemen hesap oluşturun ve başlayın</p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full h-12 gap-2" onClick={() => handleSocialSignup("Google")}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google ile Devam Et
            </Button>
            <Button variant="outline" className="w-full h-12 gap-2" onClick={() => handleSocialSignup("Apple")}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple ile Devam Et
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
              veya
            </span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  className={`pl-10 h-12 ${errors.name ? "border-destructive" : ""}`}
                />
                {!errors.name && formData.name && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`}
                />
                {!errors.email && formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555 123 45 67"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setErrors({ ...errors, phone: "" });
                  }}
                  className={`pl-10 h-12 ${errors.phone ? "border-destructive" : ""}`}
                />
                {!errors.phone && formData.phone && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            {/* Business Details Section */}
            {showBusinessForm && (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20 mt-6">
                <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                  <Store className="w-5 h-5" />
                  <span>İşletme Bilgileri</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">İşletme Adı *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Örn: Ayşe Telefon Tamir"
                      value={businessData.businessName}
                      onChange={(e) => {
                        setBusinessData({ ...businessData, businessName: e.target.value });
                        setErrors({ ...errors, businessName: "" });
                      }}
                      className={`pl-10 h-12 ${errors.businessName ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">İşletme Adresi *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="businessAddress"
                      placeholder="Tam adres..."
                      value={businessData.businessAddress}
                      onChange={(e) => {
                        setBusinessData({ ...businessData, businessAddress: e.target.value });
                        setErrors({ ...errors, businessAddress: "" });
                      }}
                      className={`pl-10 min-h-20 ${errors.businessAddress ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.businessAddress && <p className="text-sm text-destructive">{errors.businessAddress}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">İşletme Telefonu *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder="0212 123 45 67"
                      value={businessData.businessPhone}
                      onChange={(e) => {
                        setBusinessData({ ...businessData, businessPhone: e.target.value });
                        setErrors({ ...errors, businessPhone: "" });
                      }}
                      className={`pl-10 h-12 ${errors.businessPhone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.businessPhone && <p className="text-sm text-destructive">{errors.businessPhone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Sunduğunuz Hizmetler *</Label>
                  <Textarea
                    id="services"
                    placeholder="Örn: Telefon ekran değişimi, pil değişimi, yazılım güncelleme..."
                    value={businessData.services}
                    onChange={(e) => {
                      setBusinessData({ ...businessData, services: e.target.value });
                      setErrors({ ...errors, services: "" });
                    }}
                    className={`min-h-20 ${errors.services ? "border-destructive" : ""}`}
                  />
                  {errors.services && <p className="text-sm text-destructive">{errors.services}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Çalışma Saatleri *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="workingHours"
                      type="text"
                      placeholder="Örn: Pazartesi-Cumartesi 09:00-18:00"
                      value={businessData.workingHours}
                      onChange={(e) => {
                        setBusinessData({ ...businessData, workingHours: e.target.value });
                        setErrors({ ...errors, workingHours: "" });
                      }}
                      className={`pl-10 h-12 ${errors.workingHours ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.workingHours && <p className="text-sm text-destructive">{errors.workingHours}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama (İsteğe Bağlı)</Label>
                  <Textarea
                    id="description"
                    placeholder="İşletmeniz hakkında ek bilgi..."
                    value={businessData.description}
                    onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                    className="min-h-24"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 mt-6">
              {showBusinessForm ? "İşletme Hesabı Talebi Gönder" : "Kayıt Ol"}
            </Button>
          </form>

          {/* Business Account Toggle */}
          {!showBusinessForm && (
            <div className="mt-6 text-center p-4 border border-border rounded-lg bg-muted/10">
              <p className="text-sm text-muted-foreground mb-2">İşletme sahibi misiniz?</p>
              <Button variant="outline" onClick={() => setShowBusinessForm(true)} className="w-full">
                <Store className="w-4 h-4 mr-2" />
                İşletme Hesabı Aç
              </Button>
            </div>
          )}

          {showBusinessForm && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowBusinessForm(false);
                  setBusinessData({
                    businessName: "",
                    businessAddress: "",
                    businessPhone: "",
                    services: "",
                    workingHours: "",
                    description: "",
                  });
                }}>
                Müşteri Hesabı Olarak Kayıt Ol
              </Button>
            </div>
          )}

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <button onClick={onSwitchToLogin} className="text-primary font-medium hover:underline">
                Giriş Yap
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
