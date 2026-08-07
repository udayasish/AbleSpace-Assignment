"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth-service";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

/** Temporary landing surface — replaced by the Tasks board next. */
export function HomePlaceholder() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userData, initializing } = useAppSelector((state) => state.auth);
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    setPending(true);
    await authService.logout().catch(() => undefined);
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <BrandMark />
      <p className="text-muted-foreground text-sm">
        {initializing ? "Loading…" : `Signed in as ${userData?.name ?? "unknown"}`}
      </p>
      <Button variant="outline" onClick={signOut} disabled={pending}>
        Log out
      </Button>
    </div>
  );
}
