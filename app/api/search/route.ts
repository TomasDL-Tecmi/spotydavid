import { spawn } from 'child_process'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return new Response(JSON.stringify([]), { status: 400 })
  }

  return new Promise((resolve) => {
    const proc = spawn('python', [
      '-m',
      'yt_dlp',
      '-j',
      `ytsearch:${query}`, // 👈 más resultados
    ])

    let output = ''

    proc.stdout.on('data', (data) => {
      output += data.toString()
    })

    proc.on('close', () => {
      const results = output
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))

      // 🎵 Filtrar solo canciones reales
      const filtered = results.filter((item) => {
        const isMusic =
          item.duration && item.duration > 60 && // más de 1 min
          item.duration < 900 && // menos de 15 min
          !/mix|playlist|short|cover|remix|live/i.test(item.title)
        return item._type === 'video' && isMusic
      })

      const formatted = filtered.map((video) => ({
        id: video.id,
        title: video.title,
        uploader: video.uploader,
        thumbnail: video.thumbnail,
        duration: video.duration,
      }))

      resolve(
        new Response(JSON.stringify(formatted), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })
}
