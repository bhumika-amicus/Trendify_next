import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/session';
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
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const initialUser = {
    isLoggedIn: Boolean(user),
    userName: user?.name || '',
    userEmail: user?.email || '',
  };

  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col bg-white text-text-body font-sans overflow-x-hidden">
        <NavBar initialUser={initialUser} />
        <main className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
