import path from 'path';
import { unlink } from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded and Cloudinary is configured
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveImage(file) {
  // Upload the file to Cloudinary and return the hosted URL
  try {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: 'warehouse_locations',
    });
    return upload.secure_url;
  } finally {
    // Always remove the temporary file created by multer
    try {
      await unlink(file.path);
    } catch {
      // ignore errors removing temp file
    }
  }
}

export async function deleteImage(imageUrl) {
  if (!imageUrl) return;
  // If the image lives on Cloudinary, remove it there
  if (imageUrl.includes('res.cloudinary.com')) {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^/.?]+/);
    if (match) {
      const publicId = match[1];
      try {
        await cloudinary.uploader.destroy(publicId);
        return;
      } catch {
        // ignore errors deleting from Cloudinary
      }
    }
  }

  // Fallback to deleting a local file if it exists
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
