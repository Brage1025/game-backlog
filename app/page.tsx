"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddGameDialog, GameFormDialog } from "@/components/game-form-dialog";
import { useGames } from "@/lib/use-games";
import { STATUS_STYLES } from "@/lib/status-styles";
import type { Game, GameStatus } from "@/lib/types";

type SortOption = "title-asc" | "title-desc" | "status";

const SORT_LABELS: Record<SortOption, string> = {
  "title-asc": "Title (A–Z)",
  "title-desc": "Title (Z–A)",
  status: "Status",
};

const STATUS_FILTERS: (GameStatus | "All")[] = [
  "All",
  "Backlog",
  "Playing",
  "Completed",
  "Dropped",
];

// --- Page ---------------------------------------------------------------------

export default function Home() {
  const [games, setGames] = useGames();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GameStatus | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");

  function handleAddGame(game: Game) {
    setGames((prev) => [game, ...prev]);
  }

  function handleEditGame(updatedGame: Game) {
    setGames((prev) =>
      prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)),
    );
  }

  function handleDeleteGame(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"? This can't be undone.`,
    );
    if (!confirmed) return;
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  const filteredGames = useMemo(() => {
    let result = games.filter((game) =>
      game.title.toLowerCase().includes(query.toLowerCase()),
    );

    if (statusFilter !== "All") {
      result = result.filter((game) => game.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [games, query, statusFilter, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Your Library
          </h1>
        </header>

        {/* Count + Add button */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {games.length} {games.length === 1 ? "game" : "games"}
          </p>
          <AddGameDialog onAddGame={handleAddGame} />
        </div>

        {/* Search / filter / sort bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="sm:flex-1"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as GameStatus | "All")
            }
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Sort by">
                {SORT_LABELS[sortBy]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc" label="Title (A–Z)">
                Title (A–Z)
              </SelectItem>
              <SelectItem value="title-desc" label="Title (Z–A)">
                Title (Z–A)
              </SelectItem>
              <SelectItem value="status" label="Status">
                Status
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Game grid */}
        {filteredGames.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onEditGame={handleEditGame}
                onDeleteGame={handleDeleteGame}
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            {games.length === 0
              ? "Your library is empty. Use “+ Add Game” to add your first game."
              : "No games match your search."}
          </p>
        )}
      </div>
    </main>
  );
}

// --- Game card ------------------------------------------------------------

interface GameCardProps {
  game: Game;
  onEditGame: (game: Game) => void;
  onDeleteGame: (id: string, title: string) => void;
}

function GameCard({ game, onEditGame, onDeleteGame }: GameCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card p-0 transition hover:border-slate-600">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverUrl}
            alt={`${game.title} cover art`}
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          />

          {/* Edit/delete controls: hidden until the card is hovered or focused,
              so the grid stays clean at a glance. */}
          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <GameFormDialog
              mode="edit"
              game={game}
              onSave={onEditGame}
              trigger={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  aria-label={`Edit ${game.title}`}
                >
                  <Pencil />
                </Button>
              }
            />
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={`Delete ${game.title}`}
              onClick={() => onDeleteGame(game.id, game.title)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
        <div className="p-2">
          <p className="truncate text-sm font-medium">{game.title}</p>
          <Badge
            variant="outline"
            className={`mt-1 ${STATUS_STYLES[game.status]}`}
          >
            {game.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
