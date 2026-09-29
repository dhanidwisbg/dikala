import { NextResponse } from 'next/server';
import { getAlbumById, deleteAlbum, updateAlbum, uploadImage } from '@/lib/blob-albums';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const album = await getAlbumById(id);
    
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get album' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = await deleteAlbum(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';

    // Handle Multipart FormData (when new photos are being added)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title');
      const category = formData.get('category');
      const cover = formData.get('cover');
      const existingImagesRaw = formData.get('existingImages');
      const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

      const currentAlbum = await getAlbumById(id);
      if (!currentAlbum) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }

      const folderName = currentAlbum.assetFolder || currentAlbum.title || id;

      // Extract newly added photos
      const newImageUrls = [];
      const newFiles = [];
      for (const [key, value] of formData.entries()) {
        if (key === 'newPhotos' && value instanceof Blob) {
          const buffer = Buffer.from(await value.arrayBuffer());
          newFiles.push({
            name: value.name,
            data: buffer,
            size: buffer.length,
          });
        }
      }

      // Check limits
      const totalImages = existingImages.length + newFiles.length;
      if (totalImages > 10) {
        return NextResponse.json({ error: 'Maksimal 10 foto per album' }, { status: 400 });
      }

      const MAX_SIZE = 2 * 1024 * 1024;
      const oversized = newFiles.filter(f => f.size > MAX_SIZE);
      if (oversized.length > 0) {
        return NextResponse.json({ error: `${oversized.length} file melebihi batas 2 MB` }, { status: 400 });
      }

      // Upload newly added files
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const ext = file.name ? path.extname(file.name) || '.jpg' : '.jpg';
        const filename = `img-extra-${Date.now()}-${i + 1}${ext.startsWith('.') ? ext : `.${ext}`}`;
        const url = await uploadImage(file.data, folderName, filename);
        newImageUrls.push(url);
      }

      const combinedImages = [...existingImages, ...newImageUrls];

      const updated = await updateAlbum(id, {
        title,
        category,
        images: combinedImages,
        cover: cover || combinedImages[0],
      });

      return NextResponse.json(updated);
    }

    // Handle regular JSON updates (e.g., removing a photo, re-ordering, renaming)
    const body = await request.json();
    const updated = await updateAlbum(id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}
