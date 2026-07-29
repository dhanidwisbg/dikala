'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioPage() {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/albums')
      .then((res) => res.json())
      .then((data) => {
        const albumList = data.albums || [];
        setAlbums(albumList);
        const cats = [...new Set(albumList.map((a) => a.category))].sort();
        setCategories(cats);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const filtered =
    activeCategory === 'All'
      ? albums
      : albums.filter((a) => a.category === activeCategory);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-white text-sm uppercase tracking-widest font-bold mb-2 block">
          Our Work
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">Portfolio</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8" />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'All'
                ? 'bg-white text-black'
                : 'border border-gray-600 text-gray-400 hover:border-white hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'border border-gray-600 text-gray-400 hover:border-white hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Album Grid */}
      {!loaded ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No albums found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album, index) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className={`group relative aspect-[4/5] overflow-hidden rounded-sm block opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              {/* Cover Image */}
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Permanent Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Album Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-gray-300 text-xs uppercase tracking-widest font-medium block mb-1">
                  {album.category}
                </span>
                <h3 className="font-serif text-2xl text-white mb-1 group-hover:translate-y-0 transform transition-transform duration-300">
                  {album.title}
                </h3>
                <span className="text-gray-400 text-sm">
                  {album.images.length} photos
                </span>
              </div>

              {/* Arrow Icon on Hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
