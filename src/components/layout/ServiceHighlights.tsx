import { CreditCard, Headphones, Truck } from 'lucide-react';

interface ServiceHighlight {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const serviceHighlights: ServiceHighlight[] = [
  {
    title: 'Secure payments',
    description: 'Safe and secure credit card payments',
    icon: <CreditCard className="w-8 h-8 text-brand-orange" />,
  },
  {
    title: 'Help center',
    description: 'Call or chat online for support 24/7',
    icon: <Headphones className="w-8 h-8 text-brand-orange" />,
  },
  {
    title: 'Reliable shipping',
    description: 'Rely on our dependable shipping services',
    icon: <Truck className="w-8 h-8 text-brand-orange" />,
  },
];

/**
 * ServiceHighlights Component (React Server Component)
 * Static trust indicators placed at the bottom of the Home page.
 */
export default function ServiceHighlights() {
  return (
    <section className="bg-surface-dark px-5 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
        {serviceHighlights.map((service) => (
          <div key={service.title} className="flex items-center gap-5">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/10 p-3">
              {service.icon}
            </div>
            <div>
              <h3 className="m-0 mb-1 text-base font-semibold text-white">
                {service.title}
              </h3>
              <p className="m-0 text-xs text-gray-300 md:text-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
