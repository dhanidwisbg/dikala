import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'albums.json');
const ALBUMS_PUBLIC_DIR = path.join(process.cwd(), 'public', 'albums');

/**
 * Read all albums from the JSON file
 */
export function getAlbums() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  return data.albums || [];
}

/**
 * Get a single album by its slug ID
 */
export function getAlbumById(id) {
  const albums = getAlbums();
  return albums.find((album) => album.id === id) || null;
}

/**
 * Get all unique categories
 */
export function getCategories() {
  const albums = getAlbums();
  const categories = [...new Set(albums.map((a) => a.category))];
  return categories.sort();
}

/**
 * Write a new album to the JSON file and create its image directory.
 * Returns the created album object.
 */
export function createAlbum({ title, category, date, images }) {
  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Ensure the album directory exists
  const albumDir = path.join(ALBUMS_PUBLIC_DIR, slug);
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir, { recursive: true });
  }

  // Save images and build image path list
  const imagePaths = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = path.extname(img.name) || '.jpg';
    const filename = `img-${i + 1}${ext}`;
    const filePath = path.join(albumDir, filename);

    // img.data is a Buffer
    fs.writeFileSync(filePath, img.data);
    imagePaths.push(`/albums/${slug}/${filename}`);
  }

  // Build album object
  const album = {
    id: slug,
    title,
    category,
    cover: imagePaths[0] || '',
    date: date || new Date().toISOString().split('T')[0],
    images: imagePaths,
    createdAt: new Date().toISOString(),
  };

  // Read existing data, append, and write back
  const albums = getAlbums();
  albums.push(album);
  fs.writeFileSync(DATA_PATH, JSON.stringify({ albums }, null, 2), 'utf-8');

  return album;
}

/**
 * Delete an album by ID — removes from JSON and deletes the image directory
 */
export function deleteAlbum(id) {
  const albums = getAlbums();
  const filtered = albums.filter((a) => a.id !== id);

  if (filtered.length === albums.length) {
    return false; // Not found
  }

  // Delete the album image directory
  const albumDir = path.join(ALBUMS_PUBLIC_DIR, id);
  if (fs.existsSync(albumDir)) {
    fs.rmSync(albumDir, { recursive: true, force: true });
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify({ albums: filtered }, null, 2), 'utf-8');
  return true;
}
