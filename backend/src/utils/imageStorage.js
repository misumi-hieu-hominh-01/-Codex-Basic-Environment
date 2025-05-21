import path from 'path';
import { unlink } from 'fs/promises';

export function saveImage(file) {
  // Store relative path; in production, upload to Cloudinary and return URL.
  return `/uploads/locations/${file.filename}`;
}

export async function deleteImage(imageUrl) {
  if (!imageUrl) return;
  // Only delete local files. In production, delete from Cloudinary instead.
  if (imageUrl.startsWith('/uploads/locations/')) {
    const imagePath = path.join(
      process.cwd(),
      'public',
      imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    );
    try {
      await unlink(imagePath);
    } catch {
      // ignore errors removing file
    }
  }
}
