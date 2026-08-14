"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LeaveWorkspaceDialog } from "@/components/settings/leave-workspace-dialog";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-section";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";
import { usersService } from "@/lib/users-service";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { UpdateProfileInput } from "@/types/api";

export function ProfileView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.userData);

  const save = async (patch: UpdateProfileInput) => {
    try {
      dispatch(login({ userData: await usersService.updateMe(patch) }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save changes",
      );
    }
  };

  return (
    <SettingsShell title="Profile">
      <SettingsSection>
        <SettingsRow label="Profile picture">
          {user ? (
            <Avatar className="size-9">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
              <AvatarFallback className="text-xs">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="size-9 rounded-full" />
          )}
        </SettingsRow>

        <SettingsRow label="Email">
          <EmailField
            value={user?.email ?? null}
            onSave={(email) => save({ email })}
          />
        </SettingsRow>

        <SettingsRow label="Full name">
          <TextField
            value={user?.name ?? ""}
            placeholder="Your name"
            onSave={(name) => save({ name })}
          />
        </SettingsRow>

        <SettingsRow label="Title" description="Your job title or role">
          <TextField
            value={user?.title ?? ""}
            placeholder="Designer"
            allowEmpty
            onSave={(title) => save({ title })}
          />
        </SettingsRow>

        <SettingsRow
          label="Username"
          description="One word, like a nickname or first name"
        >
          <TextField
            value={user?.username ?? ""}
            placeholder="Username"
            onSave={(username) => save({ username })}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Workspace access">
        <SettingsRow label="Remove yourself from the workspace">
          <LeaveWorkspaceDialog
            onLeft={() => {
              router.replace("/login");
              router.refresh();
            }}
          />
        </SettingsRow>
      </SettingsSection>
    </SettingsShell>
  );
}

/** Saves on blur or Enter; Escape reverts. Figma shows no save button. */
function TextField({
  value,
  placeholder,
  allowEmpty,
  autoFocus,
  onSave,
}: {
  value: string;
  placeholder: string;
  allowEmpty?: boolean;
  autoFocus?: boolean;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(value);

  // Adjusting state during render is the documented way to follow a prop.
  if (value !== saved) {
    setSaved(value);
    setDraft(value);
  }

  const commit = () => {
    const next = draft.trim();
    if (next === value) return;
    if (!next && !allowEmpty) return setDraft(value);
    onSave(next);
  };

  return (
    <Input
      autoFocus={autoFocus}
      value={draft}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") setDraft(value);
      }}
      className="w-[180px]"
    />
  );
}

/** Figma shows the address as text with a pencil, so editing is opt-in. */
function EmailField({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <TextField
        autoFocus
        value={value ?? ""}
        placeholder="you@example.com"
        onSave={(email) => {
          setEditing(false);
          onSave(email);
        }}
      />
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className={value ? undefined : "text-muted-foreground"}>
        {value ?? "No email on this account"}
      </span>
      <button
        type="button"
        aria-label="Edit email"
        onClick={() => setEditing(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Pencil className="size-3.5" />
      </button>
    </span>
  );
}
