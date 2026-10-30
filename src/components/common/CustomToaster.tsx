'use client';

import { Toaster } from 'react-hot-toast';

/**
 * Global Brand-Themed Toaster Component.
 * Configured with Trendify brand orange (#ff4f0a), smooth animations,
 * bottom-right placement, and tailored icons.
 */
export default function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        duration: 2500,
        style: {
          border: '1px solid #ff4f0a',
          padding: '14px 18px',
          color: '#1f2937',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow:
            '0 10px 15px -3px rgba(255, 79, 10, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          background: '#ffffff',
        },
        success: {
          iconTheme: {
            primary: '#ff4f0a',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            border: '1px solid #dc2626',
            padding: '14px 18px',
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow:
              '0 10px 15px -3px rgba(220, 38, 38, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            background: '#ffffff',
          },
          iconTheme: {
            primary: '#dc2626',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
