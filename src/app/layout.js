import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dikala.vercel.app'),
  title: {
    default: 'DIKALA Photography',
    template: '%s | DIKALA Photography',
  },
  description:
    'Storytelling through the lens. We create timeless visual narratives for those who cherish memories. Professional photography services in Medan, Indonesia.',
  keywords: ['photography', 'wedding photography', 'portrait', 'graduation photography', 'Medan', 'DIKALA', 'Indonesia'],
  authors: [{ name: 'DIKALA Photography' }],
  openGraph: {
    title: 'DIKALA Photography',
    description: 'Storytelling through the lens. Timeless visual narratives.',
    url: 'https://dikala.vercel.app',
    siteName: 'DIKALA Photography',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'DIKALA Photography Portfolio',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIKALA Photography',
    description: 'Storytelling through the lens. Timeless visual narratives in Medan, Indonesia.',
    images: ['/images/hero-bg.jpg'],
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
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
