"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isActive = currentStep === index + 1;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                      ? "border-emerald-600 text-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.2)]"
                      : "border-muted-foreground/30 text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3px]" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="absolute top-10 flex flex-col items-center text-center min-w-[120px]">
                  <span
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap transition-colors duration-300",
                      isActive ? "text-emerald-700" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-[2px] w-full mx-4 transition-all duration-500",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Spacer for titles */}
      <div className="h-10 invisible" aria-hidden="true" />
    </div>
  );
}
