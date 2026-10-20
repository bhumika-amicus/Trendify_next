'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, LogIn, Menu, X, Store, Info } from 'lucide-react';
import ProductSearch from '@/components/product/ProductSearch';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const pathname = usePathname();

  const closeMenu = () => setIsMobileMenuOpen(false);
  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getMobileLinkClass = (path: string) =>
    `flex items-center gap-3 py-3 border-b border-gray-100 text-base font-medium transition-colors hover:text-brand-orange ${
      isLinkActive(path)
        ? 'text-brand-orange underline underline-offset-4 decoration-2 font-bold'
        : 'text-gray-700'
    }`;

  return (
    <header className="relative w-full border-b border-border-subtle bg-white">
      {/* Main header row */}
      <div className="mx-auto flex w-full max-w-360 items-center justify-between px-4.5 py-3 sm:px-6 md:h-17.5 md:px-10 md:py-0">

        {/* Mobile Menu Toggle (Left) */}
        <button
          type="button"
          className="flex items-center justify-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex shrink-0 items-center no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          onClick={closeMenu}
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
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-orange ${isLinkActive('/')
                ? 'text-brand-orange underline underline-offset-4 decoration-2'
                : 'text-gray-600'
              }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-orange ${isLinkActive('/products')
                ? 'text-brand-orange underline underline-offset-4 decoration-2'
                : 'text-gray-600'
              }`}
          >
            Products
          </Link>

          <Link
            href="/about"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-orange ${isLinkActive('/about')
                ? 'text-brand-orange underline underline-offset-4 decoration-2'
                : 'text-gray-600'
              }`}
          >
            About
          </Link>

          <Link
            href="/login"
            className="flex cursor-pointer items-center gap-1.75 border-0 bg-transparent text-sm font-medium text-gray-600 transition-colors hover:text-brand-orange focus-visible:outline-none"
          >
            <span>Sign In</span>
            <LogIn size={18} />
          </Link>

          <Link
            href="/cart"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium no-underline transition-colors hover:text-brand-orange text-gray-600"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={22} />
            <span>{cartCount}</span>
          </Link>
        </nav>

        {/* Mobile Icons (Right) - Sign In & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="/login"
            className="flex items-center text-gray-700 hover:text-brand-orange transition-colors focus-visible:outline-none"
            aria-label="Sign In"
          >
            <LogIn size={24} />
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-1.5 no-underline transition-colors hover:text-brand-orange text-gray-700"
            aria-label="Shopping cart"
            onClick={closeMenu}
          >
            <ShoppingCart size={27} />
            <span className="text-xl font-semibold">{cartCount}</span>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-border-subtle bg-white shadow-md md:hidden">
          <nav className="flex flex-col px-4.5 py-2 sm:px-6">
            <Link
              href="/"
              onClick={closeMenu}
              className={getMobileLinkClass('/')}
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={closeMenu}
              className={getMobileLinkClass('/products')}
            >
              <Store size={20} />
              Products
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className={getMobileLinkClass('/about')}
            >
              <Info size={20} />
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
