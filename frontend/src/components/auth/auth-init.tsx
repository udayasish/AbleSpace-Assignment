"use client";

import { useEffect } from "react";
import { authService } from "@/lib/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/authSlice";

/** Hydrates the auth slice from the session cookie on first load. */
export function AuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        dispatch(userData ? login({ userData }) : logout());
      })
      .catch(() => dispatch(logout()));
  }, [dispatch]);

  return null;
}
