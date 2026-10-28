'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ChevronDown, LayoutDashboard, Package, LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface UserDropdownProps {
  userName: string;
  userEmail?: string;
}

/**
 * Desktop User Account Dropdown Menu.
 * Handles open/close state, outside-click & Escape dismissal, and user actions.
 */
export default function UserDropdown({ userName, userEmail }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutAction();
  };

  const isLinkActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="relative pl-2 border-l border-gray-200" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-brand-orange rounded-full text-xs font-semibold text-gray-800 transition-colors border-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        title="Account menu"
      >
        <User size={14} className="text-brand-orange" />
        <span className="capitalize max-w-28 truncate">{userName || 'User'}</span>
        <ChevronDown
          size={13}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-orange' : ''
          }`}
        />
      </button>

      {/* Floating Menu Card */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 origin-top-right focus:outline-none"
        >
          {/* User Info Header */}
          <div className="px-3.5 py-2 border-b border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-xs font-bold text-gray-900 truncate capitalize mt-0.5">
              {userName || 'User'}
            </p>
            {userEmail ? (
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{userEmail}</p>
            ) : null}
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${
                isLinkActive('/dashboard')
                  ? 'bg-orange-50 text-brand-orange font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-orange'
              }`}
            >
              <LayoutDashboard size={15} className="text-brand-orange" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/orders"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${
                isLinkActive('/orders')
                  ? 'bg-orange-50 text-brand-orange font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-orange'
              }`}
            >
              <Package size={15} className="text-gray-400" />
              <span>My Orders</span>
            </Link>
          </div>

          {/* Logout Action */}
          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/70 transition-colors border-0 bg-transparent cursor-pointer text-left focus:outline-none"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
