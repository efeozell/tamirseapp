import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full px-4 py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full mx-8" />
        
        {/* Progress Line Active */}
        <motion.div
          className="absolute top-5 left-0 h-1 gradient-primary rounded-full mx-8"
          initial={{ width: "0%" }}
          animate={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Steps */}
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <motion.div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                step < currentStep
                  ? "gradient-primary border-transparent text-primary-foreground"
                  : step === currentStep
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-muted bg-background text-muted-foreground"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: step * 0.1 }}
            >
              {step < currentStep ? (
                <motion.svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              ) : (
                step
              )}
            </motion.div>
            <span className={cn(
              "mt-2 text-xs font-medium text-center max-w-[80px]",
              step <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {labels[step - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
