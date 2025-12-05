import { ServiceRequest } from "../../types/request";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Clock, MapPin, ChevronRight } from "lucide-react";

interface RequestCardProps {
  request: ServiceRequest;
  onClick: () => void;
}

const statusConfig = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    dotColor: "bg-yellow-500",
  },
  approved: {
    label: "Onaylandı",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  in_progress: {
    label: "İşlemde",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    dotColor: "bg-orange-500",
  },
  completed: {
    label: "Tamamlandı",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
    dotColor: "bg-green-500",
  },
  rejected: {
    label: "Reddedildi",
    color: "bg-red-500/10 text-red-700 border-red-500/20",
    dotColor: "bg-red-500",
  },
};

export function RequestCard({ request, onClick }: RequestCardProps) {
  const status = statusConfig[request.status];
  const hasUnreadMessages = request.messages.some(
    (msg) => msg.sender === "business" && msg.timestamp > new Date(Date.now() - 3600000)
  );

  return (
    <Card
      className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {request.vehicle.brand} {request.vehicle.model}
            </h3>
            {hasUnreadMessages && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Talep No: #{request.requestNumber}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{request.shopName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {new Date(request.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {request.selectedIssues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {request.selectedIssues.slice(0, 2).map((issue) => (
            <Badge key={issue} variant="secondary" className="text-xs">
              {issue}
            </Badge>
          ))}
          {request.selectedIssues.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{request.selectedIssues.length - 2}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${status.color} border`}>
          <div className={`w-1.5 h-1.5 ${status.dotColor} rounded-full mr-1.5`} />
          {status.label}
        </Badge>
        {hasUnreadMessages && (
          <Badge variant="default" className="text-xs">
            Yeni Mesaj
          </Badge>
        )}
      </div>
    </Card>
  );
}
