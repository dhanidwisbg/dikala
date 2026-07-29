import { NextResponse } from 'next/server';
import { getAlbums, createAlbum } from '@/lib/albums';

export async function GET() {
  try {
    const albums = getAlbums();
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Failed to load albums' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title');
    const category = formData.get('category');
    const date = formData.get('date');
    const coverIndex = parseInt(formData.get('coverIndex') || '0', 10);
    
    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
    }

    // Extract all files
    const photos = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'photos' && value instanceof Blob) {
        // value is a File object in Next.js
        const buffer = Buffer.from(await value.arrayBuffer());
        photos.push({
          name: value.name,
          data: buffer,
          type: value.type
        });
      }
    }

    if (photos.length === 0) {
      return NextResponse.json({ error: 'At least one photo is required' }, { status: 400 });
    }

    // Put cover image first if a coverIndex is specified
    if (coverIndex > 0 && coverIndex < photos.length) {
      const cover = photos.splice(coverIndex, 1)[0];
      photos.unshift(cover);
    }

    const album = createAlbum({
      title,
      category,
      date,
      images: photos,
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
