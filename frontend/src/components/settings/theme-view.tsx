"use client";

import { Check, Moon, Sun } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import { SettingsShell } from "@/components/settings/settings-shell";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types/api";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeView() {
  const { themeMode, setThemeMode } = usePreferences();

  return (
    <SettingsShell title="Theme">
      <section className="flex flex-col gap-6">
        <h2 className="text-base leading-none font-medium">Interface theme</h2>
        <div className="divide-y rounded-lg border">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setThemeMode(option.value)}
              aria-pressed={themeMode === option.value}
              className="hover:bg-accent/50 flex min-h-[60px] w-full items-center gap-3 px-6 py-3 text-left first:rounded-t-lg last:rounded-b-lg"
            >
              <option.icon className="text-muted-foreground size-4" />
              <span className="text-sm font-medium">{option.label}</span>
              <Check
                className={cn(
                  "ml-auto size-4",
                  themeMode === option.value ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </section>
    </SettingsShell>
  );
}
