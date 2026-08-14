import { apiFetch } from "./api";
import type { UpdateProfileInput, User } from "@/types/api";

export const usersService = {
  updateMe: (body: UpdateProfileInput) =>
    apiFetch<User>("/users/me", { method: "PATCH", body }),

  /** "Leave workspace" — deletes the account and everything it owns. */
  deleteMe: () =>
    apiFetch<{ removed: boolean }>("/users/me", { method: "DELETE" }),
};
