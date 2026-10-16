import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Trendify | Premium E-Commerce Store',
  description: 'Shop the latest electronics, fashion, and essentials with verified quality, fast shipping, and easy returns.',
};

/**
 * Root Shared Layout (React Server Component)
 * Provides the universal HTML shell, NavBar, Main content area, and Footer across all pages.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col bg-white text-text-body font-sans overflow-x-hidden">
        <NavBar />
        <main className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
