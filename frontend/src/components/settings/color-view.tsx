"use client";

import { Check } from "lucide-react";
import {
  ACCENT_OPTIONS,
  usePreferences,
} from "@/components/preferences-provider";
import { SettingsShell } from "@/components/settings/settings-shell";
import { cn } from "@/lib/utils";

export function ColorView() {
  const { accent, setAccent } = usePreferences();

  return (
    <SettingsShell title="Color">
      <section className="flex flex-col gap-6">
        <h2 className="text-base leading-none font-medium">Accent colour</h2>
        <div className="divide-y rounded-lg border">
          {ACCENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAccent(option.value)}
              aria-pressed={accent === option.value}
              className="hover:bg-accent/50 flex min-h-[60px] w-full items-center gap-3 px-6 py-3 text-left first:rounded-t-lg last:rounded-b-lg"
            >
              <span className={cn("size-4 rounded-sm", option.swatch)} />
              <span className="text-sm font-medium">{option.label}</span>
              <Check
                className={cn(
                  "ml-auto size-4",
                  accent === option.value ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </section>
    </SettingsShell>
  );
}
