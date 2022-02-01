export function formatSeconds(s: number): string {
  return `${(s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s}`
}
