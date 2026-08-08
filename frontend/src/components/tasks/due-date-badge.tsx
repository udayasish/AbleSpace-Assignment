import { Calendar } from "lucide-react";

/** Figma: text-xs font-medium, base/destructive #DC2626 on a tinted pill. */
export function DueDateBadge({ date }: { date: string }) {
  const label = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return (
    <span className="text-destructive bg-destructive/10 inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium">
      <Calendar className="size-3" />
      {label}
    </span>
  );
}
