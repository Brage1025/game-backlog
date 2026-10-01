import { NextRequest, NextResponse } from "next/server";

interface RawgGame {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
}

interface RawgSearchResponse {
  results: RawgGame[];
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    console.error("RAWG_API_KEY is not set in .env.local");
    return NextResponse.json(
      { error: "Game search isn't configured." },
      { status: 500 },
    );
  }

  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("search", query);
  url.searchParams.set("page_size", "6");

  try {
    const rawgResponse = await fetch(url.toString());

    if (!rawgResponse.ok) {
      return NextResponse.json(
        { error: "RAWG request failed." },
        { status: rawgResponse.status },
      );
    }

    const data: RawgSearchResponse = await rawgResponse.json();

    const results = data.results.map((game) => ({
      id: game.id,
      name: game.name,
      coverUrl: game.background_image,
      releaseYear: game.released ? game.released.slice(0, 4) : null,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("RAWG search failed:", error);
    return NextResponse.json({ error: "Game search failed." }, { status: 502 });
  }
}
