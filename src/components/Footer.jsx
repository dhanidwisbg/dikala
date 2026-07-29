import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">DIKALA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Capturing moments that last a lifetime. Professional photography
              services for weddings, portraits, and events.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <p className="text-gray-400 text-sm">dikalamdn@gmail.com</p>
            <p className="text-gray-400 text-sm">+62 812-6034-6719</p>
            <p className="text-gray-400 text-sm">
              <a
                href="https://www.tiktok.com/@dikala.mdn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Medan, Indonesia
              </a>
            </p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/dikala.mdn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@dikala.mdn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Tiktok
              </a>
              <a
                href="https://linktr.ee/dikala.mdn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Linktree
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} DIKALA Photography. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
