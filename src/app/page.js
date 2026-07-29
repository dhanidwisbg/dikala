import Link from 'next/link';
import { getAlbums } from '@/lib/albums';

export const metadata = {
  title: 'Home | DIKALA Photography',
};

export default function HomePage() {
  const albums = getAlbums();
  // Show 3 most recent albums for the featured section
  const featured = albums
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50 grayscale-off"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 tracking-tight leading-none animate-fade-in-up">
            Kala itu, <span className="text-gradient-gold italic">Saat Ini,</span> Dan Seterusnya.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
            Storytelling through the lens. We create timeless visual narratives for those who
            cherish memories.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/portfolio"
              className="px-8 py-3 btn-gradient font-medium rounded-full hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
            >
              View Work
            </Link>
            <a
              href="https://linktr.ee/dikala.mdn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-white text-white font-medium rounded-sm hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
            >
              Book Session
            </a>
          </div>
        </div>
      </div>

      {/* Featured / Curated Collections */}
      <section className="py-20 bg-gradient-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-gradient mb-4">
              Curated Collections
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer block"
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <h3 className="font-serif text-3xl text-white border-b-2 border-white pb-2 mb-2">
                    {album.title}
                  </h3>
                  <span className="text-gray-300 text-sm uppercase tracking-widest">
                    {album.category} · {album.images.length} photos
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-block px-8 py-3 border border-gray-600 text-white font-medium rounded-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm"
            >
              View All Albums
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
