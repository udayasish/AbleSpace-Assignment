"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usersService } from "@/lib/users-service";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function LeaveWorkspaceDialog({ onLeft }: { onLeft: () => void }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const leave = async () => {
    setLeaving(true);
    try {
      await usersService.deleteMe();
      dispatch(logout());
      onLeft();
    } catch {
      toast.error("Could not leave the workspace");
      setLeaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive bg-destructive/10 hover:bg-destructive/15 hover:text-destructive h-9"
        >
          Leave Workspace
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave workspace?</DialogTitle>
          <DialogDescription>
            This deletes your account along with every task, project and comment
            you own. It cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={leaving} onClick={leave}>
            {leaving ? "Leaving…" : "Leave workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
