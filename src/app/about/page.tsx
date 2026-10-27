import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import AboutCard from '@/components/about/AboutCard';
import { whoWeAreCards, whatWeStandForCards } from '@/data/aboutData';

export const metadata: Metadata = {
  title: 'About Trendify | E-Commerce',
  description:
    'Pioneering access to top quality products worldwide. Learn about Trendify, who we are, and what we stand for.',
};

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

      {/* 2. Introductory "Our Story" Section */}
      <section
        id="story"
        className="bg-white py-12 px-4 sm:px-6 md:px-10 border-b border-border-subtle"
      >
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

      {/* 3. "Who We Are" Section with Reusable AboutCard Component */}
      <section className="bg-surface-subtle py-16 px-4 sm:px-6 md:px-10 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main text-center mb-12">
            Who We Are
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whoWeAreCards.map((card) => (
              <AboutCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. "What We Stand For" Section with Reusable AboutCard Component */}
      <section className="bg-white py-16 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main text-center mb-12">
            What We Stand For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatWeStandForCards.map((card) => (
              <AboutCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
