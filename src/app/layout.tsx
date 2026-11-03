import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import CustomToaster from '@/components/common/CustomToaster';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Trendify | Premium E-Commerce Store',
  description: 'Shop the latest electronics, fashion, and essentials with verified quality, fast shipping, and easy returns.',
};

/**
 * Root Shared Layout (React Server Component)
 * Provides the universal HTML shell, NavBar, Main content area, and Footer across all pages.
 * Kept strictly synchronous and free from cookies() to allow pure static generation (SSG / ISR).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col bg-white text-text-body font-sans overflow-x-hidden">
        <CartProvider>
          <NavBar />
          <main className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </CartProvider>
        <CustomToaster />
      </body>
    </html>
  );
}
