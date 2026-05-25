export function encodeIds(slugs: string[]): string {
  return slugs.join(',')
}

export function decodeIds(param: string | undefined): string[] {
  if (!param) return []
  return param
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 3)
}
