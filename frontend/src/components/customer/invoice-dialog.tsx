import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ServiceRequest } from "../../types/request";
import { FileText, Download, Calendar, User, Car, Building2, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface InvoiceDialogProps {
  request: ServiceRequest | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceDialog({ request, open, onClose }: InvoiceDialogProps) {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    window.print();
  };

  const invoiceDate = format(request.updatedAt, "dd MMMM yyyy", { locale: tr });
  const invoiceNumber = `FAT-${request.requestNumber}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Hizmet Faturası
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary">FATURA</h2>
              <p className="text-sm text-muted-foreground">#{invoiceNumber}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                {invoiceDate}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Durum</div>
              <div className="px-3 py-1 bg-green-500/10 text-green-700 border border-green-500/20 rounded-full text-sm font-medium inline-block">
                Tamamlandı
              </div>
            </div>
          </div>

          <Separator />

          {/* Business & Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Info */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Hizmet Sağlayıcı
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p className="font-medium">{request.businessName}</p>
                {request.shopId && (
                  <p className="text-sm text-muted-foreground">İşletme ID: {request.shopId.substring(0, 8)}</p>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Müşteri Bilgileri
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p className="font-medium">{request.customerName}</p>
                {request.customerPhone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {request.customerPhone}
                  </p>
                )}
                {request.customerEmail && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {request.customerEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              Araç Bilgileri
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Marka & Model</p>
                  <p className="font-medium">
                    {request.vehicle.brand} {request.vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yıl</p>
                  <p className="font-medium">{request.vehicle.year}</p>
                </div>
                {request.vehicle.mileage && (
                  <div>
                    <p className="text-sm text-muted-foreground">Kilometre</p>
                    <p className="font-medium">{request.vehicle.mileage} km</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-semibold mb-3">Hizmet Detayları</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Açıklama</th>
                    <th className="text-right p-3 text-sm font-medium">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">
                      <p className="font-medium">{request.selectedIssues.join(", ") || "Araç Tamiri"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{request.issueDescription}</p>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {request.price
                        ? `₺${request.price.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : request.actualPrice || request.estimatedPrice || "Belirtilmedi"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Toplam Tutar</span>
              <span className="text-2xl font-bold text-primary">
                {request.price
                  ? `₺${request.price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : request.actualPrice || request.estimatedPrice || "Belirtilmedi"}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Talep Tarihi</p>
              <p className="font-medium mt-1">{format(request.createdAt, "dd MMMM yyyy HH:mm", { locale: tr })}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Tamamlanma Tarihi</p>
              <p className="font-medium mt-1">{format(request.updatedAt, "dd MMMM yyyy HH:mm", { locale: tr })}</p>
            </div>
          </div>

          {/* Notes */}
          {request.comment && (
            <div>
              <h3 className="font-semibold mb-2">Müşteri Yorumu</h3>
              <div className="p-3 bg-muted/30 rounded-lg text-sm">{request.comment}</div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            <p>Bu belge elektronik olarak oluşturulmuştur.</p>
            <p className="mt-1">Tamirse platformu üzerinden gerçekleştirilen hizmet için düzenlenmiştir.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 print:hidden">
            <Button onClick={handlePrint} className="flex-1" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Yazdır
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              PDF İndir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
