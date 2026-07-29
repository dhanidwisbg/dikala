import { NextResponse } from 'next/server';
import { getAlbumById, deleteAlbum, updateAlbum } from '@/lib/albums';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Next.js 15 requires awaiting params
    const album = getAlbumById(id);
    
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
    const success = deleteAlbum(id);
    
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
    const body = await request.json();
    const updated = updateAlbum(id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}
