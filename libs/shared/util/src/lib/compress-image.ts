export async function downsizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const MAX = 1080;
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);

  // WebP has ~25‑30% better compression than JPEG at same perceptual quality
  return canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
}
