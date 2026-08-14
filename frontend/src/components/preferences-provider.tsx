"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { usersService } from "@/lib/users-service";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { AccentColor, ThemeMode, UpdateProfileInput } from "@/types/api";

export const ACCENT_STORAGE_KEY = "pyramid-accent";
export const DEFAULT_ACCENT: AccentColor = "blue";

export const ACCENT_OPTIONS: {
  value: AccentColor;
  label: string;
  swatch: string;
}[] = [
  { value: "amber", label: "Amber", swatch: "bg-amber-500" },
  { value: "blue", label: "Blue", swatch: "bg-blue-500" },
  { value: "pink", label: "Pink", swatch: "bg-pink-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-500" },
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "black", label: "Black", swatch: "bg-neutral-900" },
];

interface PreferencesValue {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const PreferencesContext = createContext<PreferencesValue>({
  accent: DEFAULT_ACCENT,
  setAccent: () => {},
  themeMode: "light",
  setThemeMode: () => {},
});

function applyAccent(accent: AccentColor) {
  document.documentElement.dataset.accent = accent;
  localStorage.setItem(ACCENT_STORAGE_KEY, accent);
}

/**
 * The inline script in the root layout stamps data-accent before first paint.
 * Reading it through useSyncExternalStore keeps render pure and SSR-safe; the
 * script runs once, so there is nothing to subscribe to.
 */
const noopSubscribe = () => () => {};

function usePaintedAccent() {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      (document.documentElement.dataset.accent as AccentColor | undefined) ??
      DEFAULT_ACCENT,
    () => DEFAULT_ACCENT,
  );
}

/** Owns theme + accent: paints immediately, then persists to the account. */
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const painted = usePaintedAccent();
  const storedAccent = useAppSelector(
    (state) => state.auth.userData?.accentColor,
  );
  const storedTheme = useAppSelector((state) => state.auth.userData?.themeMode);
  const signedIn = useAppSelector((state) => state.auth.status);

  // Set only by user action, so it can shadow the account value optimistically.
  const [chosen, setChosen] = useState<AccentColor | null>(null);
  const accent = chosen ?? storedAccent ?? painted;

  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  useEffect(() => {
    if (storedTheme) setTheme(storedTheme);
  }, [storedTheme, setTheme]);

  const persist = useCallback(
    (patch: UpdateProfileInput) => {
      if (!signedIn) return;
      usersService
        .updateMe(patch)
        .then((userData) => dispatch(login({ userData })))
        .catch(() => undefined);
    },
    [dispatch, signedIn],
  );

  const setAccent = useCallback(
    (next: AccentColor) => {
      setChosen(next);
      persist({ accentColor: next });
    },
    [persist],
  );

  const setThemeMode = useCallback(
    (next: ThemeMode) => {
      setTheme(next);
      persist({ themeMode: next });
    },
    [persist, setTheme],
  );

  return (
    <PreferencesContext
      value={{
        accent,
        setAccent,
        themeMode: theme === "dark" ? "dark" : "light",
        setThemeMode,
      }}
    >
      {children}
    </PreferencesContext>
  );
}

export const usePreferences = () => useContext(PreferencesContext);
