"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { authService } from "@/lib/auth-service";
import { login } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function LoginCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);

  const continueAsGuest = async () => {
    setPending(true);
    try {
      const { user } = await authService.guestLogin();
      dispatch(login({ userData: user }));
      router.replace("/tasks");
      // Drops the cached RSC payload from before the auth cookie existed.
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not start a guest session",
      );
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Let&apos;s get back on track</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Figma login buttons: h-9, rounded-4xl, text-sm (larger than app buttons). */}
        <Button
          size="lg"
          className="w-full rounded-4xl px-3 text-sm"
          onClick={continueAsGuest}
          disabled={pending}
        >
          {pending ? "Starting session…" : "Continue as Guest"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-4xl px-3 text-sm"
          disabled={pending}
          onClick={() => toast("Google login is not available in this demo")}
        >
          <GoogleIcon className="size-4" />
          Login with Google
        </Button>
      </CardContent>
    </Card>
  );
}
