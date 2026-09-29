import { put, del, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const ALBUMS_JSON_KEY = 'dikala/albums.json';
const LOCAL_DATA_PATH = path.join(process.cwd(), 'data', 'albums.json');
const LOCAL_PUBLIC_ALBUMS_DIR = path.join(process.cwd(), 'public', 'albums');

// Helper to determine if Vercel Blob is configured
function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Local filesystem helpers
function getLocalAlbums() {
  try {
    if (!fs.existsSync(LOCAL_DATA_PATH)) return [];
    const raw = fs.readFileSync(LOCAL_DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return data.albums || [];
  } catch (err) {
    console.error('Error reading local albums:', err);
    return [];
  }
}

function saveLocalAlbums(albums) {
  fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify({ albums }, null, 2), 'utf-8');
}

/**
 * Read all albums.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is configured.
 * Automatically seeds Blob with data/albums.json if empty.
 * Falls back to local filesystem if Blob token is not available.
 */
export async function getAlbums() {
  if (!isBlobConfigured()) {
    return getLocalAlbums();
  }

  try {
    const { blobs } = await list({ prefix: ALBUMS_JSON_KEY });

    if (blobs.length === 0) {
      // Seed with local albums on first cloud run
      const localAlbums = getLocalAlbums();
      if (localAlbums.length > 0) {
        await saveAlbums(localAlbums);
      }
      return localAlbums;
    }

    const response = await fetch(blobs[0].url, { cache: 'no-store' });
    const data = await response.json();
    return data.albums || [];
  } catch (error) {
    console.error('Error reading albums from blob, falling back to local:', error);
    return getLocalAlbums();
  }
}

/**
 * Save all albums metadata to Vercel Blob or local disk
 */
async function saveAlbums(albums) {
  if (!isBlobConfigured()) {
    saveLocalAlbums(albums);
    return;
  }

  const jsonContent = JSON.stringify({ albums }, null, 2);
  return await put(ALBUMS_JSON_KEY, jsonContent, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

/**
 * Get a single album by its slug ID
 */
export async function getAlbumById(id) {
  const albums = await getAlbums();
  return albums.find((album) => album.id === id) || null;
}

/**
 * Get all unique categories
 */
export async function getCategories() {
  const albums = await getAlbums();
  const categories = [...new Set(albums.map((a) => a.category))];
  return categories.sort();
}

/**
 * Upload an image to Vercel Blob or save locally
 */
async function uploadImage(buffer, folderName, filename) {
  if (isBlobConfigured()) {
    const blobPath = `dikala/albums/${folderName}/${filename}`;
    const blob = await put(blobPath, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });
    return blob.url;
  }

  // Local fallback: save to public/albums/{folderName}/{filename}
  const dir = path.join(LOCAL_PUBLIC_ALBUMS_DIR, folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/albums/${encodeURIComponent(folderName)}/${filename}`;
}

/**
 * Create a new album
 */
export async function createAlbum({ title, category, date, images }) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const folderName = title.trim();

  const imageUrls = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = img.name ? path.extname(img.name) || '.jpg' : '.jpg';
    const filename = `img-${i + 1}${ext.startsWith('.') ? ext : `.${ext}`}`;
    const url = await uploadImage(img.data, folderName, filename);
    imageUrls.push(url);
  }

  const album = {
    id: slug,
    title,
    category,
    cover: imageUrls[0] || '',
    date: date || new Date().toISOString().split('T')[0],
    images: imageUrls,
    assetFolder: folderName,
    createdAt: new Date().toISOString(),
  };

  const albums = await getAlbums();
  albums.push(album);
  await saveAlbums(albums);

  return album;
}

/**
 * Delete an album by ID
 */
export async function deleteAlbum(id) {
  const albums = await getAlbums();
  const album = albums.find((a) => a.id === id);

  if (!album) {
    return false;
  }

  // If on Blob, remove blob files
  if (isBlobConfigured()) {
    for (const imageUrl of album.images) {
      if (imageUrl.startsWith('http')) {
        try {
          await del(imageUrl);
        } catch (err) {
          console.error(`Failed to delete blob: ${imageUrl}`, err);
        }
      }
    }
  } else {
    // If local, remove directory
    const folderName = album.assetFolder || id;
    const albumDir = path.join(LOCAL_PUBLIC_ALBUMS_DIR, folderName);
    if (fs.existsSync(albumDir)) {
      fs.rmSync(albumDir, { recursive: true, force: true });
    }
  }

  const filtered = albums.filter((a) => a.id !== id);
  await saveAlbums(filtered);
  return true;
}

/**
 * Update an existing album's metadata
 */
export async function updateAlbum(id, { title, category, images, cover, assetFolder }) {
  const albums = await getAlbums();
  const index = albums.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const album = albums[index];

  if (title) album.title = title;
  if (category) album.category = category;
  if (Array.isArray(images)) {
    album.images = images;
    // Auto-update cover if current cover was deleted or not in list
    if (!album.images.includes(album.cover)) {
      album.cover = album.images[0] || '';
    }
  }
  if (cover && album.images.includes(cover)) {
    album.cover = cover;
  }

  if (assetFolder && assetFolder !== album.assetFolder) {
    album.assetFolder = assetFolder;
    // If local assets folder exists
    const assetPath = path.join(process.cwd(), 'public', 'assets', assetFolder);
    if (fs.existsSync(assetPath)) {
      const files = fs.readdirSync(assetPath).filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
      files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      const newImages = files.map(f => `/assets/${assetFolder}/${f}`);
      if (newImages.length > 0) {
        album.images = newImages;
        album.cover = newImages[0];
      }
    }
  }

  await saveAlbums(albums);
  return album;
}

export { uploadImage };
