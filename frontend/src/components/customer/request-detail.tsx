import { useState } from "react";
import { ServiceRequest } from "../../types/request";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RequestTimeline } from "./request-timeline";
import { RateRequestDialog } from "./rate-request-dialog";
import { InvoiceDialog } from "./invoice-dialog";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Star,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RequestDetailProps {
  request: ServiceRequest | null;
  open: boolean;
  onClose: () => void;
  onRequestUpdated?: () => void;
}

export function RequestDetail({ request, open, onClose, onRequestUpdated }: RequestDetailProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  if (!request) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Lütfen bir mesaj yazın");
      return;
    }
    toast.success("Mesajınız gönderildi");
    setNewMessage("");
  };

  const handleMarkComplete = () => {
    toast.success("Talep tamamlandı olarak işaretlendi");
  };

  const statusConfig = {
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    approved: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    in_progress: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    completed: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-red-500/10 text-red-700 border-red-500/20",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">Talep Detayı #{request.requestNumber}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {new Date(request.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Durum Takibi</TabsTrigger>
              <TabsTrigger value="messages">
                Mesajlar
                {request.messages.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {request.messages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="details">Detaylar</TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <RequestTimeline currentStatus={request.status} timeline={request.timeline} />

              {request.status === "completed" && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900 mb-1">İşlem Tamamlandı</h4>
                        <p className="text-sm text-green-700 mb-3">
                          Talebiniz başarıyla tamamlandı. Hizmet için teşekkür ederiz!
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {!request.rating && (
                            <Button
                              onClick={() => setShowRatingDialog(true)}
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700">
                              <Star className="w-4 h-4 mr-2" />
                              Hizmeti Değerlendir
                            </Button>
                          )}
                          {request.rating && (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= request.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-green-700">Değerlendirmeniz kaydedildi</span>
                            </div>
                          )}
                          <Button
                            onClick={() => setShowInvoiceDialog(true)}
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-700 hover:bg-green-50">
                            <FileText className="w-4 h-4 mr-2" />
                            Fatura Görüntüle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              {request.messages.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Henüz mesaj bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] ${
                          message.sender === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
                        } rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium opacity-70">
                            {message.sender === "customer" ? "Siz" : request.shopName}
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
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  message.sender === "customer" ? "bg-primary-foreground/10" : "bg-background"
                                }`}>
                                {attachment.type === "image" ? (
                                  <ImageIcon className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                                <span className="text-xs flex-1">{attachment.name}</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input */}
              <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-background via-background to-transparent">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Textarea
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold mb-3">Araç Bilgileri</h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Marka & Model</span>
                    <span className="font-medium">
                      {request.vehicle.brand} {request.vehicle.model}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Model Yılı</span>
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
                <h3 className="font-semibold mb-3">Arıza Detayı</h3>
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
                  <p className="text-sm">{request.issueDescription}</p>
                </div>
              </div>

              {/* Shop Info */}
              <div>
                <h3 className="font-semibold mb-3">Atölye Bilgileri</h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{request.shopName}</span>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Atölyeyi Ara
                  </Button>
                </div>
              </div>

              {/* Pricing */}
              {(request.estimatedPrice || request.actualPrice) && (
                <div>
                  <h3 className="font-semibold mb-3">Fiyatlandırma</h3>
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                    {request.estimatedPrice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tahmini Tutar</span>
                        <span className="font-medium">{request.estimatedPrice}</span>
                      </div>
                    )}
                    {request.actualPrice && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Net Tutar</span>
                          <span className="font-semibold text-lg">{request.actualPrice}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {request.status === "in_progress" && (
                <Button variant="outline" className="w-full" onClick={handleMarkComplete}>
                  Tamamlandı Olarak İşaretle
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Rating Dialog */}
      <RateRequestDialog
        requestId={request?.id || null}
        businessName={request?.businessName || ""}
        open={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        onSuccess={onRequestUpdated}
      />

      {/* Invoice Dialog */}
      <InvoiceDialog request={request} open={showInvoiceDialog} onClose={() => setShowInvoiceDialog(false)} />
    </Dialog>
  );
}
