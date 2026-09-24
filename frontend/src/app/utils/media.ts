export function isVideoMediaUrl(url?: string | null): boolean {
  return Boolean(url && /\.(mp4|webm|ogg|mov|m4v)(?:[?#]|$)/i.test(url));
}
