"use client";

import { useState, type FormEvent, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Game, GameStatus } from "@/lib/types";
import { useGameSearch, type GameSearchResult } from "@/lib/use-game-search";

const STATUS_OPTIONS: GameStatus[] = [
  "Backlog",
  "Playing",
  "Completed",
  "Dropped",
];

// Empty-string sentinel so the coverUrl field can stay optional without
// fighting the Input component's controlled-value typing.
const FALLBACK_COVER = "https://placehold.co/300x400?text=No+Cover";

interface GameFormDialogProps {
  /** "add" shows blank fields and creates a new id; "edit" pre-fills from `game`. */
  mode: "add" | "edit";
  /** Required when mode is "edit" -- the game being edited. */
  game?: Game;
  /** Called with the finished game on submit. */
  onSave: (game: Game) => void;
  /** The element that opens the dialog, e.g. a Button or icon button. */
  trigger: ReactElement;
}

export function GameFormDialog({
  mode,
  game,
  onSave,
  trigger,
}: GameFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(game?.title ?? "");
  const [coverUrl, setCoverUrl] = useState(game?.coverUrl ?? "");
  const [status, setStatus] = useState<GameStatus>(game?.status ?? "Backlog");
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { results: suggestions, loading: searchLoading } = useGameSearch(title);

  function handleSelectSuggestion(result: GameSearchResult) {
    setTitle(result.name);
    setCoverUrl(result.coverUrl ?? "");
    setShowSuggestions(false);
    if (error) setError(null);
  }

  // Re-sync the form to the game's current values every time the dialog
  // opens, so editing always starts from fresh data rather than whatever
  // was left over from the last time it was open.
  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setShowSuggestions(false);
    if (nextOpen) {
      setTitle(game?.title ?? "");
      setCoverUrl(game?.coverUrl ?? "");
      setStatus(game?.status ?? "Backlog");
      setError(null);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    onSave({
      id: game?.id ?? crypto.randomUUID(),
      title: trimmedTitle,
      coverUrl: coverUrl.trim() || FALLBACK_COVER,
      status,
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
              {mode === "add" ? "Add a game" : "Edit game"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Add a game to your backlog. You can edit it later."
                : "Update this game's details."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="relative flex flex-col gap-2">
              <Label htmlFor={`title-${mode}-${game?.id ?? "new"}`}>
                Title
              </Label>
              <Input
                id={`title-${mode}-${game?.id ?? "new"}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setShowSuggestions(true);
                  if (error) setError(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                placeholder="Elden Ring"
                autoComplete="off"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}

              {showSuggestions && (searchLoading || suggestions.length > 0) && (
                <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md">
                  {searchLoading && (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Searching...
                    </p>
                  )}
                  {!searchLoading &&
                    suggestions.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        // Prevents the input from blurring before onClick
                        // fires, which would close the dropdown first.
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectSuggestion(result)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="h-10 w-8 shrink-0 overflow-hidden rounded bg-muted">
                          {result.coverUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={result.coverUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </span>
                        <span className="flex-1 truncate">{result.name}</span>
                        {result.releaseYear && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {result.releaseYear}
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`coverUrl-${mode}-${game?.id ?? "new"}`}>
                Cover image URL (optional)
              </Label>
              <Input
                id={`coverUrl-${mode}-${game?.id ?? "new"}`}
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`status-${mode}-${game?.id ?? "new"}`}>
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as GameStatus)}
              >
                <SelectTrigger id={`status-${mode}-${game?.id ?? "new"}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">
              {mode === "add" ? "Add Game" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AddGameDialogProps {
  onAddGame: (game: Game) => void;
}

/** Thin wrapper: the "+ Add Game" button you already had, now built on GameFormDialog. */
export function AddGameDialog({ onAddGame }: AddGameDialogProps) {
  return (
    <GameFormDialog
      mode="add"
      onSave={onAddGame}
      trigger={<Button>+ Add Game</Button>}
    />
  );
}
