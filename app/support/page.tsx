"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Heart, Star } from "lucide-react";
import { QRCode, QRCodeSvg } from "@/components/ui/qr-code";

import { Card, CardContent } from "@/components/ui/card";

const ETH_ADDRESS = "0x2E1C3cB3C1d14438c003e978F3d4caD84b295cD3";

// TODO: replace with your real GitHub repo URL.
const GITHUB_URL = "https://github.com/Brage1025/game-backlog";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Support
        </h1>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
          {/* Blurb */}
          <div>
            <Heart className="size-8 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              Enjoying Game Backlog?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I built this as a personal project to learn TypeScript, Tailwind,
              and Next.js. But if it has been useful to you, or you just want to
              help keep it going, a small tip is always appreciated. But more
              importantly, it costs nothing to follow along or star the project
              on GitHub instead, and that helps much more.
            </p>
          </div>

          {/* ETH QR card */}
          <Card>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="rounded-lg bg-white p-3">
                <QRCode value={ETH_ADDRESS} size={160}>
                  <QRCodeSvg />
                </QRCode>
              </div>
              <div className="w-full text-center">
                <p className="text-xs text-muted-foreground">ETH</p>
                <EthAddress address={ETH_ADDRESS} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GitHub */}
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <ExternalLink className="size-6 shrink-0" />
              <div>
                <p className="font-medium">Follow or star on GitHub</p>
                <p className="text-sm text-muted-foreground">
                  Free, and it genuinely helps.
                </p>
              </div>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Star className="size-4" />
              Open GitHub
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function EthAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked by browser permissions; the address
      // is still visible below for a manual copy either way.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs text-foreground hover:bg-accent"
    >
      <span className="truncate">{address}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
