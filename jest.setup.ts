import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

interface MockImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  fill?: boolean;
  blurDataURL?: string;
  placeholder?: string;
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    const cleanProps = { ...props };
    delete cleanProps.priority;
    delete cleanProps.fill;
    delete cleanProps.blurDataURL;
    delete cleanProps.placeholder;
    return React.createElement('img', { ...cleanProps, alt: cleanProps.alt || '' });
  },
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));
