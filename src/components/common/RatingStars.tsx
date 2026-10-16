import { Star, StarHalf } from 'lucide-react';

export interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  scoreFormat?: 'simple' | 'fraction';
  className?: string;
}

const STAR_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

/**
 * RatingStars Component (React Server Component)
 * Renders static star ratings without needing client-side hydration.
 */
export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = 'md',
  showScore = true,
  scoreFormat = 'simple',
  className = '',
}: RatingStarsProps) {
  const safeRating = Math.max(0, Math.min(maxRating, rating));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const emptyStars = Math.max(0, maxRating - fullStars - (hasHalfStar ? 1 : 0));
  const starClass = STAR_SIZES[size] || STAR_SIZES.md;

  return (
    <div className={`flex items-center text-brand-orange ${className}`.trim()}>
      <span className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${starClass} fill-current`} />
        ))}
        {hasHalfStar && <StarHalf className={`${starClass} fill-current`} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${starClass} text-gray-300`} />
        ))}
      </span>

      {showScore && (
        <span className="ml-2 text-sm font-semibold text-text-muted">
          {scoreFormat === 'fraction'
            ? `${safeRating.toFixed(1)} / ${maxRating}`
            : safeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
