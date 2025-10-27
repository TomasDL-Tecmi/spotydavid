// Archivo: app/api/stream/route.ts
// (El único archivo que tenés que cambiar)

import { spawn } from "child_process";

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const id = urlParams.get("id");

  if (!id) {
    return new Response("Missing video ID", { status: 400 });
  }

  console.log(`[STREAM] Iniciando stream directo para ID: ${id}`);

  // ⚠️ CAMBIO CLAVE:
  // -f "bestaudio[ext=m4a]/bestaudio" -> Formato (sigue igual)
  // -o "-" -> Imprime el audio a "standard output" (stdout) en vez de a un archivo
  const proc = spawn("python", [
    "-m", "yt_dlp",
    "-f", "bestaudio[ext=m4a]/bestaudio",
    "-o", "-", // ¡Esta es la magia!
    `https://www.youtube.com/watch?v=${id}`,
  ]);

  // 1. Manejar errores del proceso (si yt-dlp falla)
  let errorOutput = "";
  proc.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  // 2. Crear un "ReadableStream" (un stream web)
  // Esto adapta el stream de "stdout" de Node.js a un stream que el navegador entiende
  const webStream = new ReadableStream({
    start(controller) {
      // Cuando yt-dlp empieza a mandar datos de audio...
      proc.stdout.on("data", (chunk) => {
        controller.enqueue(chunk); // ...los mandamos al navegador
      });

      // Cuando yt-dlp termina...
      proc.stdout.on("end", () => {
        console.log("[STREAM] yt-dlp stdout finalizado.");
        controller.close(); // ...cerramos el stream
      });
    },
    cancel() {
      // Si el usuario cierra la pestaña, matamos el proceso de yt-dlp
      console.log("[STREAM] Cliente desconectado, matando proceso yt-dlp.");
    	proc.kill();
    }
  });

  proc.on("close", (code) => {
    if (code !== 0) {
      console.error(`[STREAM] yt-dlp cerró con código ${code}: ${errorOutput}`);
      // Si el proceso falla, el stream se cerrará y el 'onError' del tag <audio>
      // en el frontend se disparará.
    } else {
      console.log("[STREAM] Proceso yt-dlp completado exitosamente.");
    }
  });

  // 3. Devolver el stream de audio directamente al navegador
  return new Response(webStream, {
    headers: {
      // El formato m4a usa el contenedor 'audio/mp4'
      "Content-Type": "audio/mp4",
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes", // Importante para la barra de progreso
    },
  });
}