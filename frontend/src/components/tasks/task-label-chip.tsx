import { Tag } from "lucide-react";

export function TaskLabelChip({ label }: { label: string }) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium">
      <Tag className="size-3" />
      {label}
    </span>
  );
}
