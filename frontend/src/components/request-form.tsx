import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Car, FileText, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Shop } from "../types/shop";
import { useRequestStore } from "../store/request-store";
import { toast } from "sonner";

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  preSelectedShop?: Shop;
}

const carBrands = [
  "Toyota",
  "Honda",
  "Ford",
  "BMW",
  "Mercedes",
  "Volkswagen",
  "Audi",
  "Renault",
  "Peugeot",
  "Fiat",
  "Hyundai",
  "Nissan",
];

const commonIssues = [
  "Motor Arızası",
  "Fren Sorunu",
  "Elektrik Arızası",
  "Kaporta Hasarı",
  "Boya İşlemi",
  "Periyodik Bakım",
  "Lastik Değişimi",
  "Klima Arızası",
];

export function RequestForm({ open, onClose, preSelectedShop }: RequestFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    issueDescription: "",
    selectedIssues: [] as string[],
    shopId: preSelectedShop?.id || "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const { createRequest, isLoading } = useRequestStore();

  const handleSubmit = async () => {
    try {
      // TODO: POST /requests - Create new service request
      await createRequest({
        shopId: formData.shopId,
        vehicle: {
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
        },
        issueDescription: formData.issueDescription,
        selectedIssues: formData.selectedIssues,
      });

      toast.success("Talebiniz başarıyla oluşturuldu!");
      onClose();
      setStep(1);
      setFormData({
        brand: "",
        model: "",
        year: "",
        mileage: "",
        issueDescription: "",
        selectedIssues: [],
        shopId: preSelectedShop?.id || "",
      });
    } catch (error: any) {
      toast.error(error.message || "Talep oluşturulamadı");
      console.error("Failed to create request:", error);
    }
  };

  const toggleIssue = (issue: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedIssues: prev.selectedIssues.includes(issue)
        ? prev.selectedIssues.filter((i) => i !== issue)
        : [...prev.selectedIssues, issue],
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.brand && formData.model && formData.year;
      case 2:
        return formData.issueDescription || formData.selectedIssues.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Talep Oluştur</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={step === 1 ? "text-primary font-medium" : ""}>Araç Bilgileri</span>
            <span className={step === 2 ? "text-primary font-medium" : ""}>Arıza Detayı</span>
            <span className={step === 3 ? "text-primary font-medium" : ""}>Özet</span>
          </div>
        </div>

        {/* Step 1: Vehicle Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-primary" />
              <h3>Araç Bilgileriniz</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marka *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value: string) => setFormData((prev) => ({ ...prev, brand: value }))}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Marka seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="Örn: Corolla, Civic, Focus"
                  value={formData.model}
                  onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Model Yılı *</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2020"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilometre</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="150000"
                    value={formData.mileage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Issue Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3>Arıza Detayları</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Yaygın Sorunlar (İsteğe bağlı)</Label>
                <div className="flex flex-wrap gap-2">
                  {commonIssues.map((issue) => (
                    <Badge
                      key={issue}
                      variant={formData.selectedIssues.includes(issue) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                      onClick={() => toggleIssue(issue)}>
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detaylı Açıklama *</Label>
                <Textarea
                  id="description"
                  placeholder="Arıza hakkında detaylı bilgi verin. Ne zaman başladı, hangi belirtiler var, vs."
                  rows={6}
                  value={formData.issueDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueDescription: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Detaylı açıklama, atölyenin size daha iyi hizmet vermesini sağlar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3>Talep Özeti</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Araç</p>
                  <p className="font-medium">
                    {formData.brand} {formData.model} ({formData.year})
                  </p>
                  {formData.mileage && <p className="text-sm text-muted-foreground">{formData.mileage} km</p>}
                </div>

                {formData.selectedIssues.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Seçilen Sorunlar</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedIssues.map((issue) => (
                        <Badge key={issue} variant="secondary">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Açıklama</p>
                  <p className="text-sm">{formData.issueDescription}</p>
                </div>

                {preSelectedShop && (
                  <div>
                    <p className="text-sm text-muted-foreground">Atölye</p>
                    <p className="font-medium">{preSelectedShop.name}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ℹ️ Talebiniz gönderildikten sonra, seçili atölye size en kısa sürede geri dönüş yapacaktır.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={step === 1 ? onClose : handlePrev} disabled={step === 3}>
            {step === 1 ? (
              "İptal"
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Geri
              </>
            )}
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              İleri
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              Talep Gönder
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
