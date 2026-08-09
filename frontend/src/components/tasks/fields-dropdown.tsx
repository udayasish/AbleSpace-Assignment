"use client";

import { LayoutGrid, List, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type BoardView = "list" | "board";

export const FIELD_KEYS = [
  "priority",
  "members",
  "dueDate",
  "labels",
  "status",
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];

export const FIELD_LABELS: Record<FieldKey, string> = {
  priority: "Priority",
  members: "Members",
  dueDate: "Due Date",
  labels: "Labels",
  status: "Status",
};

interface Props {
  view: BoardView;
  onViewChange: (view: BoardView) => void;
  fields: Record<FieldKey, boolean>;
  onFieldChange: (key: FieldKey, value: boolean) => void;
}

export function FieldsDropdown({
  view,
  onViewChange,
  fields,
  onFieldChange,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="size-4" />
          Fields
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="bg-muted mb-2 grid grid-cols-2 gap-1 rounded-md p-1">
          {(["list", "board"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onViewChange(option)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-sm px-2 py-1 text-sm font-medium capitalize",
                view === option
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {option === "list" ? (
                <List className="size-4" />
              ) : (
                <LayoutGrid className="size-4" />
              )}
              {option}
            </button>
          ))}
        </div>

        {FIELD_KEYS.map((key) => (
          <label
            key={key}
            className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm"
          >
            {FIELD_LABELS[key]}
            <Checkbox
              checked={fields[key]}
              onCheckedChange={(v) => onFieldChange(key, v === true)}
            />
          </label>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
