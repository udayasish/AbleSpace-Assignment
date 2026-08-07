import { apiFetch, ApiError } from "./api";
import type { AuthResponse, User } from "@/types/api";

export const authService = {
  guestLogin: () =>
    apiFetch<AuthResponse>("/auth/guest", { method: "POST" }),

  /** Null when not signed in, rather than throwing. */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiFetch<User>("/auth/me");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  },

  logout: () => apiFetch<{ loggedOut: boolean }>("/auth/logout", { method: "POST" }),
};
