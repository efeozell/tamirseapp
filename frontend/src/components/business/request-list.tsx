import { useState } from "react";
import { ServiceRequest } from "../../types/request";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckCircle2, XCircle, Search, Car, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RequestListProps {
  requests: ServiceRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onViewDetails: (request: ServiceRequest) => void;
}

const statusCounts = (requests: ServiceRequest[]) => {
  return {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };
};

export function RequestList({ requests, onApprove, onReject, onViewDetails }: RequestListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const counts = statusCounts(requests);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${request.vehicle.brand} ${request.vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || request.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleQuickApprove = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    onApprove(requestId);
    toast.success("Talep onaylandı");
  };

  const handleQuickReject = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    const reason = prompt("Red nedeni (isteğe bağlı):");
    onReject(requestId, reason || "");
    toast.success("Talep reddedildi");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Talep Yönetimi</h2>
          <p className="text-muted-foreground">Gelen talepleri buradan yönetin</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Talep no, müşteri veya araç ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending" className="relative">
            Yeni
            {counts.pending > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Onaylı
            {counts.approved > 0 && (
              <Badge variant="secondary" className="ml-2">
                {counts.approved}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            İşlemde
            {counts.in_progress > 0 && (
              <Badge variant="secondary" className="ml-2">
                {counts.in_progress}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Tamamlanan
            {counts.completed > 0 && (
              <Badge variant="secondary" className="ml-2">
                {counts.completed}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Tümü</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Talep bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group"
                  onClick={() => onViewDetails(request)}>
                  <div className="flex items-start gap-4">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              #{request.requestNumber}
                            </h3>
                            {request.messages.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {request.messages.length}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{request.customerName}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {request.vehicle.brand} {request.vehicle.model} ({request.vehicle.year})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>

                      {request.selectedIssues.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {request.selectedIssues.slice(0, 3).map((issue) => (
                            <Badge key={issue} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                          {request.selectedIssues.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{request.selectedIssues.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Quick Actions for Pending */}
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1"
                            onClick={(e) => handleQuickApprove(e, request.id)}>
                            <CheckCircle2 className="w-4 h-4" />
                            Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => handleQuickReject(e, request.id)}>
                            <XCircle className="w-4 h-4" />
                            Reddet
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
