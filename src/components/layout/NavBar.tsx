'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, LogIn, LogOut, Menu, X, Store, Package, User } from 'lucide-react';
import ProductSearch from '@/components/product/ProductSearch';
import { logoutAction } from '@/actions/auth';

interface NavBarProps {
  initialUser?: {
    isLoggedIn: boolean;
    userName: string;
  };
}

export default function NavBar({ initialUser }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(initialUser?.isLoggedIn ?? false);
  const [userName, setUserName] = useState(initialUser?.userName ?? '');
  const pathname = usePathname();

  const [prevUser, setPrevUser] = useState(initialUser);
  if (initialUser !== prevUser) {
    setPrevUser(initialUser);
    setIsLoggedIn(initialUser?.isLoggedIn ?? false);
    setUserName(initialUser?.userName ?? '');
  }

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserName('');
    await logoutAction();
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getMobileLinkClass = (path: string) =>
    `flex items-center gap-3 py-3 border-b border-gray-100 text-base font-medium transition-colors hover:text-brand-orange ${
      isLinkActive(path)
        ? 'text-brand-orange font-bold'
        : 'text-gray-700'
    }`;

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
          onClick={closeMenu}
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
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-orange ${
              isLinkActive('/products')
                ? 'text-brand-orange underline underline-offset-4 decoration-2 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <Store size={17} />
            <span>Products</span>
          </Link>

          <Link
            href="/orders"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-orange ${
              isLinkActive('/orders')
                ? 'text-brand-orange underline underline-offset-4 decoration-2 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <Package size={17} />
            <span>Orders</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              {/* User Account Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-800">
                <User size={14} className="text-brand-orange" />
                <span className="capitalize max-w-28 truncate">{userName || 'User'}</span>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-brand-orange hover:bg-orange-50 rounded-md transition-colors border-0 bg-transparent cursor-pointer focus-visible:outline-none"
                title="Sign Out"
              >
                <span>Sign Out</span>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors hover:text-brand-orange ${
                isLinkActive('/login')
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

        {/* Mobile Icons (Right) - Sign In / Out & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-brand-orange transition-colors focus-visible:outline-none border-0 bg-transparent p-0 cursor-pointer"
              aria-label="Sign Out"
              title={`Logged in as ${userName || 'User'}`}
            >
              <LogOut size={22} />
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-gray-700 hover:text-brand-orange transition-colors focus-visible:outline-none"
              aria-label="Sign In"
            >
              <LogIn size={22} />
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center p-1 text-gray-700 hover:text-brand-orange transition-colors"
            aria-label="Shopping cart"
            onClick={closeMenu}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-border-subtle bg-white shadow-md md:hidden">
          <nav className="flex flex-col px-4.5 py-2 sm:px-6">
            <Link
              href="/products"
              onClick={closeMenu}
              className={getMobileLinkClass('/products')}
            >
              <Store size={20} />
              Products
            </Link>

            <Link
              href="/orders"
              onClick={closeMenu}
              className={getMobileLinkClass('/orders')}
            >
              <Package size={20} />
              Orders
            </Link>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center gap-3 py-3 border-b border-gray-100 text-base font-medium text-gray-700 transition-colors hover:text-brand-orange text-left border-0 bg-transparent cursor-pointer w-full"
              >
                <LogOut size={20} />
                Sign Out ({userName || 'User'})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className={getMobileLinkClass('/login')}
              >
                <LogIn size={20} />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
