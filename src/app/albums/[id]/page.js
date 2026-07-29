'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Lightbox from '@/components/Lightbox';
import { use } from 'react';

export default function SingleAlbumPage({ params }) {
  // In Next.js 15+ we need to unwap params using `use()` if it's considered a Promise in some contexts,
  // but standard practice for client components with params in app router:
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/albums/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setAlbum(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-white font-serif mb-4">Album Not Found</h1>
          <Link href="/portfolio" className="text-gray-400 hover:text-white hover:underline transition-colors">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Project Header */}
      <div className="relative h-[60vh] flex items-end pb-20 justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={album.cover}
            alt={album.title}
            className="w-full h-full object-cover opacity-60 grayscale-off"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <span className="text-white text-sm uppercase tracking-widest font-bold mb-2 block">
            {album.category}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">
            {album.title}
          </h1>
          <div className="text-gray-400 text-sm tracking-widest uppercase flex items-center justify-center gap-4">
            <span>{new Date(album.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>{album.images.length} Photos</span>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 masonry-grid">
          {album.images.map((imgSrc, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer overflow-hidden rounded-sm mb-4"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={imgSrc}
                alt={`${album.title} - Photo ${idx + 1}`}
                className="w-full h-auto grayscale-off transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-24 pt-16 border-t border-gray-800">
          <h3 className="font-serif text-3xl text-white mb-6">Ready to start your project?</h3>
          <a
            href="https://linktr.ee/dikala.mdn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
          >
            Book This Service
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={album.images}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setCurrentImageIndex(idx)}
        />
      )}
    </>
  );
}
