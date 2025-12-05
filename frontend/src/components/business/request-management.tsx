import { useState } from "react";
import { ServiceRequest, RequestStatus } from "../../types/request";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Car, User, Phone, Mail, Calendar, FileText,
  Send, Paperclip, Image as ImageIcon, Download,
  CheckCircle2, XCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RequestManagementProps {
  request: ServiceRequest | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (requestId: string, status: RequestStatus, note?: string) => void;
  onSendMessage: (requestId: string, content: string, attachments?: File[]) => void;
}

export function RequestManagement({ 
  request, 
  open, 
  onClose,
  onUpdateStatus,
  onSendMessage
}: RequestManagementProps) {
  const [newMessage, setNewMessage] = useState("");
  const [newStatus, setNewStatus] = useState<RequestStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");

  if (!request) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Lütfen bir mesaj yazın");
      return;
    }
    onSendMessage(request.id, newMessage);
    toast.success("Mesaj gönderildi");
    setNewMessage("");
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Lütfen bir durum seçin");
      return;
    }
    onUpdateStatus(request.id, newStatus as RequestStatus, statusNote);
    toast.success("Durum güncellendi");
    setNewStatus("");
    setStatusNote("");
  };

  const handleApprove = () => {
    onUpdateStatus(request.id, "approved", "Talebiniz onaylandı. En kısa sürede işleme alınacaktır.");
    toast.success("Talep onaylandı");
  };

  const handleReject = () => {
    const reason = statusNote || "Talep işletme tarafından reddedildi";
    onUpdateStatus(request.id, "rejected", reason);
    toast.success("Talep reddedildi");
    onClose();
  };

  const statusConfig = {
    pending: { label: "Beklemede", color: "bg-yellow-500" },
    approved: { label: "Onaylandı", color: "bg-blue-500" },
    in_progress: { label: "İşlemde", color: "bg-orange-500" },
    completed: { label: "Tamamlandı", color: "bg-green-500" },
    rejected: { label: "Reddedildi", color: "bg-red-500" },
  };

  const currentStatusConfig = statusConfig[request.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <DialogTitle className="text-2xl mb-2">
                Talep #{request.requestNumber}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-2">
                  <div className={`w-2 h-2 ${currentStatusConfig.color} rounded-full mr-2`} />
                  {currentStatusConfig.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(request.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions for Pending */}
          {request.status === "pending" && (
            <div className="flex gap-2">
              <Button
                variant="default"
                className="gap-2"
                onClick={handleApprove}
              >
                <CheckCircle2 className="w-4 h-4" />
                Onayla
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4" />
                Reddet
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Customer & Vehicle Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Müşteri Bilgileri
                </h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Ad Soyad</p>
                    <p className="font-medium">{request.customerName}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href="tel:+905551234567" className="text-sm hover:text-primary">
                      +90 555 123 45 67
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href="mailto:customer@example.com" className="text-sm hover:text-primary">
                      customer@example.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Araç Bilgileri
                </h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Marka & Model</span>
                    <span className="font-medium">
                      {request.vehicle.brand} {request.vehicle.model}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Yıl</span>
                    <span className="font-medium">{request.vehicle.year}</span>
                  </div>
                  {request.vehicle.mileage && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Kilometre</span>
                        <span className="font-medium">{request.vehicle.mileage} km</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Issue Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Arıza Detayı
                </h3>
                {request.selectedIssues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {request.selectedIssues.map((issue) => (
                      <Badge key={issue} variant="secondary">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {request.issueDescription}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-semibold mb-3">Fiyatlandırma</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedPrice">Tahmini Tutar</Label>
                    <Input
                      id="estimatedPrice"
                      type="text"
                      placeholder="₺ 0.00"
                      value={estimatedPrice}
                      onChange={(e) => setEstimatedPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualPrice">Net Tutar</Label>
                    <Input
                      id="actualPrice"
                      type="text"
                      placeholder="₺ 0.00"
                      value={actualPrice}
                      onChange={(e) => setActualPrice(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Fatura Oluştur
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Messages */}
            <div className="space-y-6">
              {/* Status Management */}
              <div>
                <h3 className="font-semibold mb-3">Durum Yönetimi</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">Durumu Değiştir</Label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as RequestStatus)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Onayla</SelectItem>
                        <SelectItem value="in_progress">İşleme Al</SelectItem>
                        <SelectItem value="completed">Tamamlandı</SelectItem>
                        <SelectItem value="rejected">Reddet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statusNote">Not (Müşteriye gönderilecek)</Label>
                    <Textarea
                      id="statusNote"
                      placeholder="Durum değişikliği hakkında bilgi..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleUpdateStatus}
                    disabled={!newStatus}
                  >
                    Durumu Güncelle
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Messages */}
              <div className="space-y-4">
                <h3 className="font-semibold">Mesajlar</h3>

                {/* Message History */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {request.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Henüz mesaj bulunmuyor
                    </p>
                  ) : (
                    request.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "business" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] ${
                            message.sender === "business"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          } rounded-lg p-3`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium opacity-70">
                              {message.sender === "business" ? "Siz" : request.customerName}
                            </span>
                            <span className="text-xs opacity-50">
                              {new Date(message.timestamp).toLocaleTimeString("tr-TR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 p-2 rounded text-xs ${
                                    message.sender === "business"
                                      ? "bg-primary-foreground/10"
                                      : "bg-background"
                                  }`}
                                >
                                  {attachment.type === "image" ? (
                                    <ImageIcon className="w-3 h-3" />
                                  ) : (
                                    <FileText className="w-3 h-3" />
                                  )}
                                  <span className="flex-1">{attachment.name}</span>
                                  <Download className="w-3 h-3" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Müşteriye mesaj gönderin..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button className="flex-1 gap-2" onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                      Gönder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
