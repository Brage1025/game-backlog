"use client";

import { useState, type FormEvent, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { parseShareCode } from "@/lib/share-code";
import type { Friend } from "@/lib/types";

interface FriendCodeDialogProps {
  /** "add" matches the code to an existing friend by username (updating them)
   *  or creates a new one. "update" always overwrites `targetFriendId`. */
  mode: "add" | "update";
  targetFriendId?: string;
  friends: Friend[];
  onSave: (friend: Friend) => void;
  trigger: ReactElement;
}

export function FriendCodeDialog({
  mode,
  targetFriendId,
  friends,
  onSave,
  trigger,
}: FriendCodeDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setCode("");
      setError(null);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let payload;
    try {
      payload = parseShareCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid share code.");
      return;
    }

    const now = new Date().toISOString();

    // "update" always overwrites the friend this dialog was opened for.
    // "add" matches by username (case-insensitive) so re-pasting a friend's
    // newer code updates them automatically instead of creating a duplicate.
    const existing =
      mode === "update"
        ? friends.find((f) => f.id === targetFriendId)
        : friends.find(
            (f) => f.username.toLowerCase() === payload.username.toLowerCase(),
          );

    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      username: payload.username,
      hasAvatar: payload.hasAvatar,
      games: payload.games,
      updatedAt: now,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {mode === "add" ? "Add a friend" : "Update this friend"}
            </DialogTitle>
            <DialogDescription>
              Paste the share code they sent you. It is a snapshot of their
              library at the moment they generated it --
              {mode === "add"
                ? " if you've already added someone with the same username, this updates them instead of adding a duplicate."
                : " this replaces their current data with what's in the code."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="friend-code">Share code</Label>
            <textarea
              id="friend-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste the code here..."
              rows={5}
              autoFocus
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">
              {mode === "add" ? "Add Friend" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
