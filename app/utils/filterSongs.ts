export function isValidSong(title: string): boolean {
  const lower = title.toLowerCase()
  const banned = ['mix', 'live', 'set', 'cover', 'remix', 'concert', 'session', 'interview', 'official video', 'playlist', 'compilation', 'lyric']
  return !banned.some((word) => lower.includes(word))
}
