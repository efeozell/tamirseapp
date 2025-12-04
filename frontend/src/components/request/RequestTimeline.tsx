import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "@/lib/mockData";
import { 
  Send, 
  Building2, 
  CheckCircle2, 
  Wrench, 
  Flag 
} from "lucide-react";

interface RequestTimelineProps {
  events: TimelineEvent[];
}

const statusIcons = {
  'Talep Oluşturuldu': Send,
  'İşletmeye Ulaştı': Building2,
  'Onaylandı': CheckCircle2,
  'İşleme Alındı': Wrench,
  'Tamamlandı': Flag,
};

export function RequestTimeline({ events }: RequestTimelineProps) {
  return (
    <div className="relative space-y-0">
      {/* Vertical Line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

      {events.map((event, index) => {
        const Icon = statusIcons[event.status as keyof typeof statusIcons] || Send;
        const isLast = index === events.length - 1;
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Icon Circle */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                event.isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {event.isCompleted && !isLast && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <h4 className={cn(
                  "font-semibold",
                  event.isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {event.status}
                </h4>
                {event.isCompleted && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              <p className={cn(
                "mt-1 text-sm",
                event.isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"
              )}>
                {event.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
