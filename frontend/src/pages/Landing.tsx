import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Search, 
  Wrench, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Zap,
  MapPin,
  CheckCircle
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Search,
    title: "Dükkan Arama",
    description: "Konumunuza en yakın güvenilir servisleri anında bulun."
  },
  {
    icon: Wrench,
    title: "Kolay Talep",
    description: "Birkaç adımda tamir talebinizi oluşturun."
  },
  {
    icon: Shield,
    title: "Güvenilir Hizmet",
    description: "Doğrulanmış ve değerlendirmeli servisler."
  },
  {
    icon: Clock,
    title: "Anlık Takip",
    description: "Talebinizin durumunu gerçek zamanlı izleyin."
  }
];

const stats = [
  { value: "500+", label: "Onaylı Servis" },
  { value: "50K+", label: "Mutlu Müşteri" },
  { value: "4.8", label: "Ortalama Puan" },
  { value: "24/7", label: "Destek" }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Automotive service"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="accent" className="mb-4 px-4 py-1.5 text-sm">
                <Zap className="mr-1 h-4 w-4" />
                Türkiye'nin #1 Oto Servis Platformu
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
            >
              Aracınız İçin{" "}
              <span className="text-gradient-accent">En Doğru Adres</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8"
            >
              Güvenilir servisleri keşfedin, hızlıca teklif alın ve aracınızın
              tamirini kolayca takip edin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/request/new">
                <Button variant="hero-accent" size="xl" className="w-full sm:w-auto gap-2">
                  <Wrench className="h-5 w-5" />
                  Talep Oluştur
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shops">
                <Button variant="glass" size="xl" className="w-full sm:w-auto gap-2 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Search className="h-5 w-5" />
                  Dükkan Ara
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neden <span className="text-gradient-primary">OtoServis</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern teknoloji ile geleneksel oto tamir hizmetlerini bir araya getiriyoruz.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full text-center hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-md">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-muted-foreground">
              Üç basit adımda aracınızı tamir ettirin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Talebinizi Oluşturun", desc: "Araç bilgilerinizi ve arızanızı girin." },
              { step: 2, title: "Teklif Alın", desc: "Uygun servislerden fiyat teklifleri alın." },
              { step: 3, title: "Takip Edin", desc: "İşlemleri anlık olarak takip edin." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-accent text-2xl font-bold text-accent-foreground shadow-accent-glow">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>

                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Hemen Başlayın
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Ücretsiz kayıt olun ve aracınız için en iyi servisi bulun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="hero-accent" size="xl" className="gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ücretsiz Kayıt Ol
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Car className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">OtoServis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 OtoServis. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
