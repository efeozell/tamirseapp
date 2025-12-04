import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StepIndicator } from "@/components/request/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Car, 
  Calendar,
  Gauge,
  ChevronRight,
  ChevronLeft,
  Wrench,
  Send,
  CheckCircle,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { carBrands, commonIssues, mockShops } from "@/lib/mockData";

const steps = ["Araç Bilgileri", "Arıza Detayı", "Dükkan Seçimi"];

export default function NewRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedShopId = searchParams.get("shopId");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    description: "",
    selectedIssues: [] as string[],
    shopId: preSelectedShopId || "",
    requestMultipleQuotes: false
  });

  const handleIssueToggle = (issueId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIssues: prev.selectedIssues.includes(issueId)
        ? prev.selectedIssues.filter(id => id !== issueId)
        : [...prev.selectedIssues, issueId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Talep başarıyla oluşturuldu!", {
      description: "Dükkan talebinizi en kısa sürede değerlendirecek."
    });
    
    navigate("/requests");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.brand && formData.model && formData.year && formData.km;
      case 2:
        return formData.description || formData.selectedIssues.length > 0;
      case 3:
        return formData.shopId || formData.requestMultipleQuotes;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          labels={steps}
        />

        <AnimatePresence mode="wait">
          {/* Step 1: Vehicle Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Araç Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marka</Label>
                    <div className="relative">
                      <select
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary/50 transition-all duration-200"
                      >
                        <option value="">Marka seçin</option>
                        {carBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Örn: Corolla, Golf, 3 Serisi"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Yıl
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2020"
                        min="1990"
                        max="2024"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="km">
                        <Gauge className="inline h-4 w-4 mr-1" />
                        Kilometre
                      </Label>
                      <Input
                        id="km"
                        type="number"
                        placeholder="85000"
                        value={formData.km}
                        onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Issue Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Arıza Detayı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Select */}
                  <div>
                    <Label className="mb-3 block">Hızlı Seçim</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonIssues.map((issue) => (
                        <Badge
                          key={issue.id}
                          variant={formData.selectedIssues.includes(issue.id) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                          onClick={() => handleIssueToggle(issue.id)}
                        >
                          {formData.selectedIssues.includes(issue.id) && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {issue.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detaylı Açıklama</Label>
                    <Textarea
                      id="description"
                      placeholder="Arızanızı detaylı olarak açıklayın. Örn: Motor check lambası yanıyor, araç çalışırken titreşim var..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ne kadar detay verirseniz, o kadar doğru fiyat alırsınız.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Shop Selection */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto space-y-4"
            >
              {/* Multiple Quotes Option */}
              <Card
                className={`cursor-pointer transition-all ${
                  formData.requestMultipleQuotes
                    ? "border-accent ring-2 ring-accent/20"
                    : "hover:border-primary/30"
                }`}
                onClick={() => setFormData({ ...formData, requestMultipleQuotes: !formData.requestMultipleQuotes, shopId: "" })}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      formData.requestMultipleQuotes ? "gradient-accent" : "bg-secondary"
                    }`}>
                      <Search className={`h-6 w-6 ${formData.requestMultipleQuotes ? "text-accent-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Birden Fazla Teklif Al</h3>
                      <p className="text-sm text-muted-foreground">
                        Tüm uygun dükkanlardan teklif alın ve karşılaştırın.
                      </p>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      formData.requestMultipleQuotes ? "border-accent bg-accent" : "border-muted"
                    }`}>
                      {formData.requestMultipleQuotes && (
                        <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground py-2">
                veya
              </div>

              {/* Shop List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dükkan Seçin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockShops.slice(0, 3).map((shop) => (
                    <div
                      key={shop.id}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                        formData.shopId === shop.id
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-secondary/50 hover:bg-secondary border-2 border-transparent"
                      }`}
                      onClick={() => setFormData({ ...formData, shopId: shop.id, requestMultipleQuotes: false })}
                    >
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{shop.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {shop.distance} km • ⭐ {shop.rating}
                        </p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        formData.shopId === shop.id ? "border-primary bg-primary" : "border-muted"
                      }`}>
                        {formData.shopId === shop.id && (
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="max-w-lg mx-auto mt-6 flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Geri
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 gap-2"
            >
              İleri
              <ChevronRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="hero-accent"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Talep Gönder
                </>
              )}
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
