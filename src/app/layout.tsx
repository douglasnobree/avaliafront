import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IrrigaAi | Plataforma de Irrigação Inteligente',
  description:
    'Plataforma inovadora que utiliza inteligência artificial para otimizar sistemas de irrigação agrícola, maximizando produtividade e eficiência hídrica.',
  keywords: [
    'irrigação',
    'agricultura',
    'inteligência artificial',
    'IrrigaAi',
    'plataforma agrícola',
    'otimização hídrica',
  ],
  authors: [{ name: 'IrrigaAi Team' }],
  creator: 'IrrigaAi',
  publisher: 'IrrigaAi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://irrigaai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IrrigaAi | Plataforma de Irrigação Inteligente',
    description:
      'Plataforma inovadora que utiliza inteligência artificial para otimizar sistemas de irrigação agrícola.',
    url: 'https://irrigaai.com',
    siteName: 'IrrigaAi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IrrigaAi - Inteligência Artificial para Irrigação',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IrrigaAi | Plataforma de Irrigação Inteligente',
    description:
      'Plataforma inovadora que utiliza inteligência artificial para otimizar sistemas de irrigação agrícola.',
    creator: '@irrigaai',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
