import './globals.css';
import '../styles/theme.css';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata = {
  title: 'GlowTrack',
  description: 'Companheiro diário de skincare, maquilhagem e progresso.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${manrope.variable} bg-soft-beige text-deep-gray`}>
        {children}
      </body>
    </html>
  );
}
