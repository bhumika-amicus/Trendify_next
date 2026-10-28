import { User, Mail } from 'lucide-react';
import type { UserSession } from '@/lib/session';

interface UserProfileCardProps {
  user: UserSession;
}

/**
 * Synchronous Presentation Component:
 * Renders the user's avatar, name, and email instantly (0ms) from session cookies.
 * Does not block on any network requests or database queries.
 */
export default function UserProfileCard({ user }: UserProfileCardProps) {
  const displayName = user.name || 'Customer';
  const displayEmail = user.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
          {initial || <User size={24} />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 capitalize">{displayName}</h2>
          {displayEmail && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Mail size={14} className="text-gray-400" /> {displayEmail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
