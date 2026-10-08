const euroFormatter = new Intl.NumberFormat('fr-BE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const timeFormatter = new Intl.DateTimeFormat('fr-BE', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Brussels',
})

export function formatEuro(value: number): string {
  return euroFormatter.format(value)
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

/** 5400 → "1 heure et 30 minutes" */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const parts: string[] = []
  if (hours) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  if (!parts.length) return 'moins d’une minute'
  return parts.join(' et ')
}

/** 3725 → "01:02:05" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}
