'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Store,
  LayoutDashboard,
  Package,
  LogOut,
  User,
  UserPlus,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import type { NavUser } from './NavBar';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: NavUser;
}

/**
 * Mobile Navigation Drawer.
 * Renders user/guest header banner, main navigation links, and account actions.
 */
export default function MobileNavDrawer({
  isOpen,
  onClose,
  user,
}: MobileNavDrawerProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 py-3 border-b border-gray-100 text-base font-medium transition-colors hover:text-brand-orange ${
      isLinkActive(path) ? 'text-brand-orange font-bold' : 'text-gray-700'
    }`;

  const handleLogout = async () => {
    onClose();
    await logoutAction();
  };

  return (
    <div className="absolute left-0 top-full z-50 w-full border-b border-border-subtle bg-white shadow-md md:hidden">
      <nav className="flex flex-col px-4.5 py-3 sm:px-6">
        {/* User Account or Guest Welcome Card */}
        {user.isLoggedIn ? (
          <div className="flex items-center gap-3 py-2.5 px-3 mb-2 border border-gray-100 bg-gray-50/80 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {user.userName?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Signed in as
              </p>
              <p className="text-sm font-bold text-gray-900 truncate capitalize">
                {user.userName || 'User'}
              </p>
              {user.userEmail ? (
                <p className="text-xs text-gray-500 truncate">{user.userEmail}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 p-3 mb-2 border border-gray-100 bg-gray-50/80 rounded-lg">
            <div>
              <p className="text-xs font-bold text-gray-900">Welcome to Trendify</p>
              <p className="text-[11px] text-gray-500">Sign in to track orders & more</p>
            </div>
            <Link
              href="/login"
              onClick={onClose}
              className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-md hover:bg-brand-orange/90 transition-colors shadow-xs"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Store Navigation Section */}
        <Link href="/" onClick={onClose} className={getLinkClass('/')}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link href="/products" onClick={onClose} className={getLinkClass('/products')}>
          <Store size={20} />
          <span>All Products</span>
        </Link>

        {/* User Account / Auth Section */}
        {user.isLoggedIn ? (
          <>
            <Link href="/dashboard" onClick={onClose} className={getLinkClass('/dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link href="/orders" onClick={onClose} className={getLinkClass('/orders')}>
              <Package size={20} />
              <span>My Orders</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 py-3 border-b border-gray-100 text-base font-medium text-gray-700 transition-colors hover:text-red-600 text-left border-0 bg-transparent cursor-pointer w-full"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <Link href="/register" onClick={onClose} className={getLinkClass('/register')}>
            <UserPlus size={20} />
            <span>Create Account</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
