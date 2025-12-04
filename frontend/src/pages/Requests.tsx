import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Wrench,
  ChevronRight,
  Plus,
  Car
} from "lucide-react";
import { mockRequests, ServiceRequest } from "@/lib/mockData";

const statusConfig = {
  pending: { label: "Beklemede", color: "warning", icon: Clock },
  approved: { label: "Onaylandı", color: "info", icon: CheckCircle },
  in_progress: { label: "İşlemde", color: "accent", icon: Wrench },
  completed: { label: "Tamamlandı", color: "success", icon: CheckCircle },
  rejected: { label: "Reddedildi", color: "destructive", icon: XCircle },
};

function RequestCard({ request, index }: { request: ServiceRequest; index: number }) {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/requests/${request.id}`}>
        <Card className="hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Vehicle Image Placeholder */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">{request.vehicleModel}</h3>
                  <Badge variant={status.color as any} className="shrink-0 ml-2">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {request.issueDescription}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>#{request.id}</span>
                  <span>{request.shopName || "Dükkan bekleniyor"}</span>
                  <span>{new Date(request.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Requests() {
  const requests = mockRequests;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Taleplerim</h1>
            <p className="text-sm text-muted-foreground">
              {requests.length} aktif talep
            </p>
          </div>
          <Link to="/request/new">
            <Button variant="hero" className="gap-2">
              <Plus className="h-5 w-5" />
              Yeni Talep
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
          {["Tümü", "Beklemede", "İşlemde", "Tamamlandı"].map((filter) => (
            <Badge
              key={filter}
              variant={filter === "Tümü" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 whitespace-nowrap"
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request, index) => (
            <RequestCard key={request.id} request={request} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Wrench className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Henüz talebiniz yok</h3>
            <p className="text-muted-foreground mb-6">
              İlk servis talebinizi oluşturun.
            </p>
            <Link to="/request/new">
              <Button variant="hero" className="gap-2">
                <Plus className="h-5 w-5" />
                Talep Oluştur
              </Button>
            </Link>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
