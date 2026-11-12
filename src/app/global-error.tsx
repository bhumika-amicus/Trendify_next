'use client';

// GlobalError replaces RootLayout (layout.tsx) when the root shell crashes,
// so layout.tsx's `./globals.css` import is never loaded unless we import it here.
import './globals.css';
import { useEffect } from 'react';
import Button from '@/components/common/Button';
import StateMessage from '@/components/common/StateMessage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GLOBAL ERROR] Captured in GlobalError boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white text-text-body font-sans">
        <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 md:px-10">
          <StateMessage
            title="Something went wrong"
            message="An unexpected application error occurred. Please try again or return to the homepage."
            variant="error"
          >
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => reset()}>
                Try Again
              </Button>

              {/*
                Use a native <a> instead of <Button href="/"> (Next.js <Link>):
                when RootLayout has crashed, client-side SPA routing state may also
                be broken, so a hard browser reload safely resets the entire app.
              */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex items-center justify-center border cursor-pointer transition-all duration-200 active:scale-98 focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 bg-brand-orange text-white border-brand-orange hover:bg-brand-orange-hover hover:border-brand-orange-hover hover:shadow-[0_4px_10px_rgba(255,79,10,0.25)] px-6 py-2.5 text-sm font-bold"
              >
                Back to Home
              </a>
            </div>
          </StateMessage>
        </main>
      </body>
    </html>
  );
}
