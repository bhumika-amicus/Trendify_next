import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/common/Card';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Trendify | E-Commerce',
  description: 'Pioneering access to top quality products worldwide. Learn about Trendify, who we are, and what we stand for.',
};

const whoWeAreCards = [
  {
    image: '/about/story.jpg',
    title: 'Our Story',
    description: "Discover Trendify's rich history and learn how we have grown to be a trusted destination for quality electronics, lifestyle, and home products worldwide.",
    linkText: 'Read Our Story',
    href: '#story',
  },
  {
    image: '/about/innovation.jpg',
    title: 'Innovation History',
    description: 'Explore the milestones of innovation at Trendify, where our intelligent catalog, real-time tracking, and pioneering customer spirit continuously set industry standards.',
    linkText: 'See Our Timeline',
    href: '#innovation',
  },
  {
    image: '/about/locations.jpg',
    title: 'Corporate Locations',
    description: 'Trendify operates modern fulfillment hubs, customer care centers, and tech offices strategically located to provide swift dispatch and reliable support to customers everywhere.',
    linkText: 'View Our Locations',
    href: '#locations',
  },
];

const whatWeStandForCards = [
  {
    image: '/about/values.jpg',
    title: 'Mission and Values',
    description: 'At Trendify, our core principles drive our daily decisions and actions. We lead with a "Customer First" philosophy and are focused on making a positive difference in people\'s lives.',
    linkText: 'Learn About Our Values',
    href: '#values',
  },
  {
    image: '/about/sustainability.jpg',
    title: 'Sustainability',
    description: 'Protecting the environment is a core value at Trendify. We aim to minimize shipping footprints, promote eco-friendly packaging, and partner with responsible manufacturers.',
    linkText: 'Sustainability Efforts',
    href: '#sustainability',
  },
  {
    image: '/about/community.jpg',
    title: 'Corporate Social Responsibility',
    description: 'We believe in giving back by collaborating with local communities, championing fair labor standards, and empowering youth through education and technology initiatives.',
    linkText: 'Corporate Responsibility',
    href: '#responsibility',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner with hero.png, Breadcrumb, and About Trendify Title */}
      <section className="relative w-full overflow-hidden bg-black min-h-[260px] md:min-h-[340px] flex flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="About Trendify Banner"
            fill
            priority
            className="object-cover object-center opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Trendify' },
            ]}
            className="mb-3"
            separator="|"
            variant="on-dark"
          />

          <h1 className="m-0 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            About Trendify
          </h1>
        </div>
      </section>

      {/* 2. Introductory "Our Story" Section (Below image, without button) */}
      <section id="story" className="bg-white py-12 px-4 sm:px-6 md:px-10 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222222] tracking-tight leading-snug mb-6">
            Pioneering E-Commerce Solutions Worldwide Since 2020
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-text-body leading-relaxed max-w-6xl">
            <p>
              As a leading designer and curator of modern retail experiences, Trendify has been innovating customer-inspired products and services since its inception. Our platform helps consumers discover, purchase, and enjoy verified high-quality goods across electronics, lifestyle accessories, and apparel around the globe.
            </p>
            <p>
              Whether you are looking for advanced everyday technology, reliable home solutions, or trending fashion staples, we have curated catalogs and dependable logistics to empower your lifestyle with ease, speed, and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 3. "Who We Are" Section with Reusable Card Component */}
      <section className="bg-surface-subtle py-16 px-4 sm:px-6 md:px-10 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main text-center mb-12">
            Who We Are
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whoWeAreCards.map((card) => (
              <Card
                key={card.title}
                variant="elevated"
                className="bg-white rounded-none border-b-2 border-transparent hover:border-brand-orange transition-all duration-200"
              >
                {/* Local Image with Next.js Image Component */}
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

                  <Link
                    href={card.href}
                    className="text-sm font-bold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors mt-auto"
                  >
                    {card.linkText}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "What We Stand For" Section with Reusable Card Component */}
      <section className="bg-white py-16 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main text-center mb-12">
            What We Stand For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatWeStandForCards.map((card) => (
              <Card
                key={card.title}
                variant="elevated"
                className="bg-white rounded-none border-b-2 border-transparent hover:border-brand-orange transition-all duration-200"
              >
                {/* Local Image with Next.js Image Component */}
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

                  <Link
                    href={card.href}
                    className="text-sm font-bold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors mt-auto"
                  >
                    {card.linkText}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
