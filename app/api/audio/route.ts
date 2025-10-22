import { spawn } from "child_process";

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const id = urlParams.get("id");

  if (!id) {
    return new Response("Missing video ID", { status: 400 });
  }

  try {
    // Ejecutar yt-dlp para obtener la URL directa del audio
    const proc = spawn("python", [
      "-m",
      "yt_dlp",
      "-f",
      "bestaudio[ext=m4a]/bestaudio",
      "--get-url",
      `https://www.youtube.com/watch?v=${id}`,
    ]);

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    const exitCode: number = await new Promise((resolve) => {
      proc.on("close", resolve);
    });

    if (exitCode !== 0) {
      console.error("yt-dlp error:", errorOutput);
      return new Response(
        JSON.stringify({ error: "yt-dlp failed", details: errorOutput }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Limpia la URL (a veces viene con saltos de línea)
    const audioUrl = output.trim();

    return new Response(
      JSON.stringify({ audioUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error ejecutando yt-dlp:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
