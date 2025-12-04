import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { RequestTimeline } from "@/components/request/RequestTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft,
  Car,
  Calendar,
  Gauge,
  MessageCircle,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
  Send,
  Paperclip,
  Store
} from "lucide-react";
import { mockRequests } from "@/lib/mockData";

const statusConfig = {
  pending: { label: "Beklemede", color: "warning", icon: Clock },
  approved: { label: "Onaylandı", color: "info", icon: CheckCircle },
  in_progress: { label: "İşlemde", color: "accent", icon: Wrench },
  completed: { label: "Tamamlandı", color: "success", icon: CheckCircle },
  rejected: { label: "Reddedildi", color: "destructive", icon: XCircle },
};

export default function RequestDetail() {
  const { id } = useParams();
  const request = mockRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Talep bulunamadı.</p>
      </div>
    );
  }

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/requests">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Talep #{request.id}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <Badge variant={status.color as any} className="text-sm px-4 py-2">
            <StatusIcon className="h-4 w-4 mr-1" />
            {status.label}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Araç Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{request.vehicleModel}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {request.vehicleYear}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-4 w-4" />
                          {request.vehicleKm.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Issue Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Arıza Detayı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{request.issueDescription}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {request.selectedServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shop Info */}
            {request.shopName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      Dükkan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{request.shopName}</h3>
                        <p className="text-sm text-muted-foreground">İşlemi yürüten servis</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Durum Takibi</CardTitle>
                </CardHeader>
                <CardContent>
                  <RequestTimeline events={request.timeline} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Mesajlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-2xl ${
                        message.sender === "shop"
                          ? "bg-secondary/80 mr-8"
                          : "bg-primary/10 ml-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={message.sender === "shop" ? "secondary" : "default"}>
                          {message.sender === "shop" ? "Dükkan" : "Siz"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {message.attachments.map((file, i) => (
                            <Button key={i} variant="outline" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              {file}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Message Input */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Mesajınızı yazın..."
                        className="resize-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Paperclip className="h-4 w-4" />
                        Dosya Ekle
                      </Button>
                      <Button variant="hero" size="sm" className="gap-1">
                        <Send className="h-4 w-4" />
                        Gönder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Sticky Actions */}
      <div className="fixed bottom-20 md:bottom-4 left-0 right-0 px-4 z-40">
        <div className="container mx-auto max-w-lg">
          <div className="flex gap-3 p-4 glass rounded-2xl shadow-xl border border-border/50">
            <Button variant="outline" className="flex-1 gap-2">
              <FileText className="h-5 w-5" />
              Fatura
            </Button>
            <Button variant="success" className="flex-1 gap-2">
              <CheckCircle className="h-5 w-5" />
              Tamamlandı
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
