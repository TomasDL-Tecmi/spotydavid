import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

let ytmusic: YTMusic | null = null;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // 🔧 Inicializa una sola vez
    if (!ytmusic) {
      ytmusic = new YTMusic();
      await ytmusic.initialize();
    }

    // 🔍 Buscar
    const results = await ytmusic.search(query);

    // 🎵 Filtrar y mapear correctamente
    const songs =
      results
        ?.filter(
          (item: any) =>
            item.type === "song" || item.type === "SONG" // ✅ mayúsculas o minúsculas
        )
        .map((item: any) => {
          // obtener thumbnail válido
          const thumbArr = item.thumbnails || [];
          const thumbnail =
            thumbArr.length > 0
              ? thumbArr[thumbArr.length - 1].url
              : "/default.jpg";

          // convertir duración (número de segundos → mm:ss)
          const durationSeconds = item.duration || 0;
          const minutes = Math.floor(durationSeconds / 60);
          const seconds = Math.floor(durationSeconds % 60)
            .toString()
            .padStart(2, "0");

          return {
            id: item.videoId || "",
            title: item.name || "Sin título",
            author:
              item.artist?.name ||
              item.artists?.map((a: any) => a.name).join(", ") ||
              "Desconocido",
            thumbnail,
            duration: `${minutes}:${seconds}`,
          };
        }) || [];

    if (!songs.length) {
      console.warn("⚠️ No se encontraron canciones válidas:", results);
    } else {
      console.log(`✅ ${songs.length} canciones listas para mostrar.`);
    }

    return NextResponse.json(songs);
  } catch (err) {
    console.error("❌ Error en /api/search/streaming:", err);
    return NextResponse.json({ error: "Search error" }, { status: 500 });
  }
}
