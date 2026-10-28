'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, LogIn, Menu, X, Store, User } from 'lucide-react';
import ProductSearch from '@/components/product/ProductSearch';
import UserDropdown from './UserDropdown';
import MobileNavDrawer from './MobileNavDrawer';

export interface NavUser {
  isLoggedIn: boolean;
  userName: string;
  userEmail?: string;
}

interface NavBarProps {
  initialUser?: NavUser;
}

/**
 * Universal Navigation Bar Component.
 * Orchestrates top branding, responsive search, desktop navigation,
 * user account dropdown, and mobile navigation drawer.
 */
export default function NavBar({ initialUser }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile drawer when pathname changes (React 19 render pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const user: NavUser = initialUser ?? {
    isLoggedIn: false,
    userName: '',
    userEmail: '',
  };

  const isLinkActive = (path: string) => pathname.startsWith(path);
  const cartCount = 0;

  return (
    <header className="relative w-full border-b border-border-subtle bg-white">
      {/* Main header row */}
      <div className="mx-auto flex w-full max-w-360 items-center justify-between px-4.5 py-3 sm:px-6 md:h-17.5 md:px-10 md:py-0">
        {/* Mobile Menu Toggle (Left) */}
        <button
          type="button"
          className="flex items-center justify-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange md:hidden cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Logo (Acts as Home Navigation) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex shrink-0 items-center no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          onClick={() => setIsMobileMenuOpen(false)}
          title="Trendify Home"
        >
          <span className="text-2xl font-black italic tracking-tight text-brand-orange">
            Trendify
          </span>
        </Link>

        {/* Desktop Search (Hidden on Mobile) */}
        <div className="mx-8 hidden flex-1 max-w-2xl md:block">
          <ProductSearch
            variant="header"
            placeholder="Search for products, brands and more"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-orange ${isLinkActive('/products')
                ? 'text-brand-orange underline underline-offset-4 decoration-2 font-semibold'
                : 'text-gray-700'
              }`}
          >
            <Store size={17} />
            <span>Products</span>
          </Link>

          {user.isLoggedIn ? (
            <UserDropdown userName={user.userName} userEmail={user.userEmail} />
          ) : (
            <Link
              href="/login"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors hover:text-brand-orange ${isLinkActive('/login')
                  ? 'text-brand-orange font-bold'
                  : 'text-gray-700'
                }`}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Cart Icon with Floating Notification Pill */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center p-1.5 text-gray-700 hover:text-brand-orange transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={23} />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </nav>

        {/* Mobile Icons (Right) - Profile / Sign In & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          {user.isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center text-gray-700 hover:text-brand-orange transition-colors focus-visible:outline-none"
              aria-label="My Dashboard"
              title={`Logged in as ${user.userName || 'User'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={22} className="text-brand-orange" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-gray-700 hover:text-brand-orange transition-colors focus-visible:outline-none"
              aria-label="Sign In"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn size={22} />
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center p-1 text-gray-700 hover:text-brand-orange transition-colors"
            aria-label="Shopping cart"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Mobile Search Row (Below Top Row) */}
      <div className="block px-4.5 pb-3 sm:px-6 md:hidden">
        <ProductSearch
          variant="header"
          placeholder="Search for products, brands and more"
        />
      </div>

      {/* Mobile Collapsible Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
      />
    </header>
  );
}
