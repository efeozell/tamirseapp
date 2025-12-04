import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Car, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  ArrowLeft,
  Chrome
} from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(mode === "login" ? "Giriş başarılı!" : "Kayıt başarılı!", {
      description: mode === "login" 
        ? "Yönlendiriliyorsunuz..." 
        : "Hesabınız oluşturuldu."
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" ? "Hoş Geldiniz" : "Kayıt Ol"}
            </CardTitle>
            <CardDescription>
              {mode === "login" 
                ? "Hesabınıza giriş yapın" 
                : "Yeni hesap oluşturun"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Mode Toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  mode === "login"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  mode === "register"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Adınız Soyadınız"
                        className="pl-10"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+90 5XX XXX XX XX"
                        className="pl-10"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  {mode === "login" && (
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Şifremi unuttum
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="confirmPassword"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    İşleniyor...
                  </div>
                ) : mode === "login" ? (
                  "Giriş Yap"
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  veya
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Chrome className="h-5 w-5" />
                Google ile Devam Et
              </Button>
              <Button variant="outline" className="w-full gap-2" size="lg">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Apple ile Devam Et
              </Button>
            </div>

            {/* Terms */}
            {mode === "register" && (
              <p className="mt-4 text-xs text-center text-muted-foreground">
                Kayıt olarak{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Business Login Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          İşletme hesabınız mı var?{" "}
          <Link to="/business/auth" className="text-primary font-medium hover:underline">
            İşletme Girişi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
