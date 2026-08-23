import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obsidian Auto Detail | Concept',
  description: 'Premium automotive detailing concept with an interactive scroll driven experience.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
