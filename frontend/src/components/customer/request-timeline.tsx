import { RequestStatus } from "../../types/request";
import { CheckCircle2, Clock, AlertCircle, XCircle, Wrench } from "lucide-react";

interface TimelineStep {
  status: RequestStatus;
  label: string;
  icon: any;
  color: string;
}

interface RequestTimelineProps {
  currentStatus: RequestStatus;
  timeline: {
    status: RequestStatus;
    timestamp: Date;
    note?: string;
  }[];
}

const timelineSteps: TimelineStep[] = [
  {
    status: "pending",
    label: "Talep Oluşturuldu",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    status: "approved",
    label: "İşletme Onayladı",
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  {
    status: "in_progress",
    label: "İşleme Alındı",
    icon: Wrench,
    color: "text-orange-500",
  },
  {
    status: "completed",
    label: "Tamamlandı",
    icon: CheckCircle2,
    color: "text-green-500",
  },
];

const getStatusIndex = (status: RequestStatus): number => {
  if (status === "rejected") return -1;
  return timelineSteps.findIndex((step) => step.status === status);
};

export function RequestTimeline({ currentStatus, timeline }: RequestTimelineProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === "rejected";

  if (isRejected) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-6 h-6 text-destructive" />
          <h3 className="font-semibold text-destructive">Talep Reddedildi</h3>
        </div>
        {timeline.find((t) => t.status === "rejected")?.note && (
          <p className="text-sm text-muted-foreground ml-9">
            {timeline.find((t) => t.status === "rejected")?.note}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {timelineSteps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const timelineEntry = timeline.find((t) => t.status === step.status);

        return (
          <div key={step.status} className="relative">
            <div className="flex items-start gap-4 pb-8">
              {/* Icon and Line */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary"
                      : isCurrent
                      ? `bg-background border-current ${step.color}`
                      : "bg-muted border-muted-foreground/20"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted
                        ? "text-primary-foreground"
                        : isCurrent
                        ? step.color
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-full absolute top-10 ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 -mt-1">
                <h4
                  className={`font-medium mb-1 ${
                    isCurrent ? step.color : isPending ? "text-muted-foreground" : ""
                  }`}
                >
                  {step.label}
                </h4>
                {timelineEntry && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(timelineEntry.timestamp).toLocaleString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {timelineEntry.note && (
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">
                        {timelineEntry.note}
                      </p>
                    )}
                  </div>
                )}
                {isCurrent && !timelineEntry && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span>Devam ediyor...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
