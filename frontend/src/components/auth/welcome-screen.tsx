import { Button } from "../ui/button";
import { Wrench, Shield, Clock, Award } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface WelcomeScreenProps {
  onSignup: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onSignup, onLogin }: WelcomeScreenProps) {
  const features = [
    {
      icon: Wrench,
      title: "Uzman Atölyeler",
      description: "Güvenilir ve deneyimli tamir servisleri",
    },
    {
      icon: Shield,
      title: "Güvenli İşlem",
      description: "Şeffaf fiyatlandırma ve garanti",
    },
    {
      icon: Clock,
      title: "Hızlı Hizmet",
      description: "Anında teklif, hızlı çözüm",
    },
    {
      icon: Award,
      title: "Kalite Garantisi",
      description: "Müşteri memnuniyeti önceliğimiz",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo and Brand */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Wrench className="w-14 h-14 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tamirse
          </h1>
          <p className="text-lg text-muted-foreground">Aracınızın doğru adresi</p>
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-md mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1727413433599-496949ef8196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwbWVjaGFuaWMlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjQ4NDMwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Auto Repair Workshop"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3 mb-8">
          <Button
            size="lg"
            className="w-full text-lg h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={onSignup}>
            Kayıt Ol
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full text-lg h-14 hover:bg-primary/5 transition-all hover:scale-105"
            onClick={onLogin}>
            Giriş Yap
          </Button>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground">© 2024 Tamirse. Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
}
