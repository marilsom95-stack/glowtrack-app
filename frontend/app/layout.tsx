import './globals.css';

import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import React from 'react';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'GlowTrack',
  description: 'Companheiro diário de skincare, maquilhagem e progresso.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="body-surface">
      <body className={`${manrope.variable} app-shell`}>
        <div className="theme-grid">
          {children}
        </div>
      </body>
    </html>
  );
}
