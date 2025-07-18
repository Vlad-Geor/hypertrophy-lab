export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // non‑alphanumerics → dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}
