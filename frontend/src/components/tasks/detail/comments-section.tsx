"use client";

import { MoreHorizontal, Paperclip, SendHorizontal, SmilePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelative, initials } from "@/lib/format";
import { tasksService } from "@/lib/tasks-service";
import type { TaskComment } from "@/types/api";

interface Props {
  taskId: string;
  comments: TaskComment[];
  onAdded: (comment: TaskComment) => void;
}

export function CommentsSection({ taskId, comments, onAdded }: Props) {
  const post = async (body: string) => {
    try {
      onAdded(await tasksService.addComment(taskId, body));
    } catch {
      toast.error("Could not post comment");
      throw new Error("failed");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-foreground text-sm font-medium">Comments</h2>

      {comments.length > 0 && (
        <div className="divide-y rounded-md border">
          {comments.map((comment) => (
            <article key={comment.id} className="flex flex-col gap-2 p-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarFallback className="text-[10px]">
                    {initials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {comment.authorName ?? "Unknown"}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatRelative(comment.createdAt)}
                </span>
                <span className="text-muted-foreground ml-auto flex items-center gap-2">
                  <SmilePlus className="size-4" />
                  <MoreHorizontal className="size-4" />
                </span>
              </div>
              <p className="text-sm break-words">{comment.body}</p>
            </article>
          ))}

          <Composer placeholder="Leave a reply..." withAvatar onSubmit={post} />
        </div>
      )}

      <div className="rounded-md border">
        <Composer placeholder="Add a comment..." onSubmit={post} />
      </div>
    </div>
  );
}

function Composer({
  placeholder,
  withAvatar,
  onSubmit,
}: {
  placeholder: string;
  withAvatar?: boolean;
  onSubmit: (body: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    const body = value.trim();
    if (!body || sending) return;

    setSending(true);
    try {
      await onSubmit(body);
      setValue("");
    } catch {
      // onSubmit already surfaced the failure; keep the draft so it isn't lost.
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3">
      {withAvatar && (
        <Avatar className="size-5">
          <AvatarFallback className="text-[10px]">You</AvatarFallback>
        </Avatar>
      )}
      <input
        value={value}
        disabled={sending}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
      <button
        type="button"
        aria-label="Attach file"
        disabled
        className="text-muted-foreground disabled:opacity-50"
      >
        <Paperclip className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Send comment"
        onClick={send}
        disabled={sending || !value.trim()}
        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <SendHorizontal className="size-4" />
      </button>
    </div>
  );
}
