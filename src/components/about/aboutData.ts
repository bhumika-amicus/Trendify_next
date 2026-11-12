export interface AboutCardItem {
  image: string;
  title: string;
  description: string;
  linkText?: string;
  href?: string;
}

export const whoWeAreCards: AboutCardItem[] = [
  {
    image: '/about/story.jpg',
    title: 'Our Story',
    description:
      "Discover Trendify's rich history and learn how we have grown to be a trusted destination for quality electronics, lifestyle, and home products worldwide.",
  },
  {
    image: '/about/innovation.jpg',
    title: 'Innovation History',
    description:
      'Explore the milestones of innovation at Trendify, where our intelligent catalog, real-time tracking, and pioneering customer spirit continuously set industry standards.',
  },
  {
    image: '/about/locations.jpg',
    title: 'Corporate Locations',
    description:
      'Trendify operates modern fulfillment hubs, customer care centers, and tech offices strategically located to provide swift dispatch and reliable support to customers everywhere.',
  },
];

export const whatWeStandForCards: AboutCardItem[] = [
  {
    image: '/about/values.jpg',
    title: 'Mission and Values',
    description:
      'At Trendify, our core principles drive our daily decisions and actions. We lead with a "Customer First" philosophy and are focused on making a positive difference in people\'s lives.',
  },
  {
    image: '/about/sustainability.jpg',
    title: 'Sustainability',
    description:
      'Protecting the environment is a core value at Trendify. We aim to minimize shipping footprints, promote eco-friendly packaging, and partner with responsible manufacturers.',
  },
  {
    image: '/about/community.jpg',
    title: 'Corporate Social Responsibility',
    description:
      'We believe in giving back by collaborating with local communities, championing fair labor standards, and empowering youth through education and technology initiatives.',
  },
];
