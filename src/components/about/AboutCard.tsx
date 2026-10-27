import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/common/Card';
import type { AboutCardItem } from '@/data/aboutData';

interface AboutCardProps {
  card: AboutCardItem;
}

export default function AboutCard({ card }: AboutCardProps) {
  return (
    <Card
      variant="elevated"
      className="bg-white rounded-none border-b-2 border-transparent hover:border-brand-orange transition-all duration-200"
    >
      {/* Image with Next.js Image Component */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-3">
          {card.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mb-6 flex-1">
          {card.description}
        </p>

        {card.href && card.linkText && (
          <Link
            href={card.href}
            className="text-sm font-bold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors mt-auto"
          >
            {card.linkText}
          </Link>
        )}
      </div>
    </Card>
  );
}
