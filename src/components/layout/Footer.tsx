import Link from 'next/link';

const footerColumns = [
  {
    title: 'QUICK LINKS',
    links: [
      { text: 'Products', href: '/products' },
      { text: 'About', href: '/about' },
      { text: 'Home', href: '/' },
    ],
  },
  {
    title: 'CUSTOMER CARE',
    links: [
      { text: 'Help Center', href: '#' },
      { text: 'Track Orders', href: '#' },
      { text: 'Returns & Refunds', href: '#' },
    ],
  },
  {
    title: 'POLICIES',
    links: [
      { text: 'Privacy Policy', href: '#' },
      { text: 'Terms of Service', href: '#' },
      { text: 'Shipping Policy', href: '#' },
    ],
  },
];

/**
 * Footer Component (React Server Component)
 * Static layout component requiring zero client-side JavaScript.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface-subtle px-6 py-10 text-text-main md:px-12 md:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr]">
        {footerColumns.map((column) => (
          <div key={column.title} className="flex flex-col">
            <h4 className="m-0 mb-5 text-sm font-bold uppercase tracking-wider text-text-main">
              {column.title}
            </h4>
            <div className="flex flex-col gap-3">
              {column.links.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Company Info & Copyright */}
        <div className="flex flex-col text-xs sm:text-sm leading-relaxed text-text-body">
          <span className="text-xl font-black italic tracking-tight text-brand-orange mb-3">
            Trendify
          </span>
          <p className="m-0 mb-3 font-semibold text-text-main">
            Copyright © 2026 Trendify. All rights reserved.
          </p>
          <p className="m-0 text-text-muted leading-normal">
            Trendify is your ultimate destination for the latest products across all categories. We bring you the most popular and trending items at unbeatable prices. Shop with confidence and elevate your lifestyle with our curated collections.
          </p>
        </div>
      </div>
    </footer>
  );
}
