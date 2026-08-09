import { Minus, Signal, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { PRIORITY_LABELS } from "@/lib/task-constants";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/api";

const ICONS: Record<TaskPriority, typeof Minus> = {
  none: Minus,
  urgent: Signal,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
};

const TONES: Record<TaskPriority, string> = {
  none: "text-muted-foreground",
  urgent: "text-destructive",
  high: "text-destructive",
  medium: "text-foreground",
  low: "text-muted-foreground",
};

export function PriorityIndicator({ priority }: { priority: TaskPriority }) {
  const Icon = ICONS[priority];
  return (
    <span className={cn("flex items-center gap-1.5 text-xs font-medium", TONES[priority])}>
      <Icon className="size-3.5" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
