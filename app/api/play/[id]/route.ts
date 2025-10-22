import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // 🚀 Inicializamos YTMusic
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    // 🔍 Buscar en YouTube Music
    const results = await ytmusic.search(query);

    // 🎵 Filtrar sólo canciones (type === "song")
    const songs =
      results
        ?.filter((item: any) => item.type === "song")
        .map((item: any) => ({
          id: item.videoId || "",
          title:
            typeof item.name === "string"
              ? item.name
              : item.name?.text || "Sin título",
          author:
            item.artists?.[0]?.name ||
            item.artist?.name ||
            "Desconocido",
          thumbnail:
            item.thumbnails?.[item.thumbnails.length - 1]?.url ||
            item.thumbnail?.url ||
            "/default.jpg",
          duration: item.duration || "0:00",
        })) || [];

    if (!songs.length) {
      console.warn("⚠️ No se encontraron canciones válidas:", results);
    }

    return NextResponse.json(songs);
  } catch (err) {
    console.error("❌ Error en /api/search/streaming:", err);
    return NextResponse.json({ error: "Search error" }, { status: 500 });
  }
}
