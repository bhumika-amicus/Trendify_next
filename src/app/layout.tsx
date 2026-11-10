import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import CustomToaster from '@/components/common/CustomToaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Trendify | Premium E-Commerce Store',
    template: '%s | Trendify',
  },
  description:
    'Shop the latest electronics, fashion, and essentials with verified quality, fast shipping, and easy returns.',
  openGraph: {
    title: 'Trendify | Premium E-Commerce Store',
    description:
      'Shop the latest electronics, fashion, and essentials with verified quality, fast shipping, and easy returns.',
    type: 'website',
    siteName: 'Trendify',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased overflow-x-hidden ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-text-body font-sans overflow-x-hidden">
        <AuthProvider>
          <CartProvider>
            <NavBar />
            <main className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        <CustomToaster />
      </body>
    </html>
  );
}
