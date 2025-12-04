import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  Building2,
  Phone,
  ArrowLeft,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

export default function BusinessAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(mode === "login" ? "Giriş başarılı!" : "Başvurunuz alındı!", {
      description: mode === "login" 
        ? "İşletme panelinize yönlendiriliyorsunuz..." 
        : "Başvurunuz inceleniyor. En kısa sürede dönüş yapılacaktır."
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>

        <Card className="shadow-2xl border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent shadow-accent-glow">
              <Building2 className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" ? "İşletme Girişi" : "İşletme Kaydı"}
            </CardTitle>
            <CardDescription>
              {mode === "login" 
                ? "İşletme panelinize giriş yapın" 
                : "Dükkanınızı platforma ekleyin"}
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
                  <>
                    <motion.div
                      key="businessName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="businessName">İşletme Adı</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Dükkan Adınız"
                          className="pl-10"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key="address"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="address">Adres</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          type="text"
                          placeholder="İşletme Adresi"
                          className="pl-10"
                          required
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="isletme@email.com"
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
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  {mode === "login" && (
                    <Link to="/business/forgot-password" className="text-xs text-primary hover:underline">
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero-accent"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    İşleniyor...
                  </div>
                ) : mode === "login" ? (
                  "Giriş Yap"
                ) : (
                  "Başvuru Yap"
                )}
              </Button>
            </form>

            {mode === "register" && (
              <p className="mt-4 text-xs text-center text-muted-foreground">
                Başvurunuz ekibimiz tarafından incelenecek ve 24 saat içinde size dönüş yapılacaktır.
              </p>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-primary-foreground/70">
          Müşteri hesabınız mı var?{" "}
          <Link to="/auth" className="text-accent font-medium hover:underline">
            Müşteri Girişi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
