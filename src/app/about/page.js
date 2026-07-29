export const metadata = {
  title: 'About Us',
  description: 'Learn about DIKALA Photography — our story, our passion, and our team.',
};

export default function AboutPage() {
  return (
    <>
      {/* Our Story Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 transform translate-x-4 translate-y-4 rounded-sm hidden md:block" />
            <img
              src="/images/about-story.png"
              alt="Our Story"
              className="relative w-full h-auto rounded-sm shadow-2xl grayscale-off"
            />
          </div>

          {/* Content */}
          <div className="text-left">
            <span className="text-white text-sm uppercase tracking-widest font-bold mb-2 block">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">Beyond the Lens</h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Founded in 2025, DIKALA was born from a passion for storytelling. We believe that
              photography is more than just clicking a button; it&apos;s about preserving moments that
              would otherwise fade.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Our team of dedicated artists works tirelessly to ensure that every smile, every tear,
              and every embrace is captured with authenticity and grace. We specialize in natural
              light photography, focusing on genuine emotions rather than rigid poses.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-white mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Member 1 */}
            <div className="group">
              <div className="aspect-square overflow-hidden mb-4 rounded-full w-48 mx-auto border-2 border-transparent group-hover:border-white transition-all">
                <img
                  src="/images/team-jhody.png"
                  alt="Jhody"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-xl text-white font-serif">Jhody</h3>
              <p className="text-white text-sm uppercase tracking-widest">Second Photographer</p>
            </div>

            {/* Member 2 */}
            <div className="group">
              <div className="aspect-square overflow-hidden mb-4 rounded-full w-48 mx-auto border-2 border-transparent group-hover:border-white transition-all">
                <img
                  src="/images/team-dila.png"
                  alt="Dila"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-xl text-white font-serif">Dila</h3>
              <p className="text-white text-sm uppercase tracking-widest">Admin</p>
            </div>

            {/* Member 3 */}
            <div className="group">
              <div className="aspect-square overflow-hidden mb-4 rounded-full w-48 mx-auto border-2 border-transparent group-hover:border-white transition-all">
                <img
                  src="/images/team-dhani.png"
                  alt="Dhani"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-xl text-white font-serif">Dhani</h3>
              <p className="text-white text-sm uppercase tracking-widest">Lead Photographer</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
