import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'DIKALA Photography',
    template: '%s | DIKALA Photography',
  },
  description:
    'Storytelling through the lens. We create timeless visual narratives for those who cherish memories. Professional photography services in Medan, Indonesia.',
  keywords: ['photography', 'wedding photography', 'portrait', 'Medan', 'DIKALA', 'Indonesia'],
  openGraph: {
    title: 'DIKALA Photography',
    description: 'Storytelling through the lens. Timeless visual narratives.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-dark text-gray-400 font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
