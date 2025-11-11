import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

/*const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});*/

export const metadata: Metadata = {
  title: 'Avalia Irriga | Avaliação de Sistemas de Irrigação',
  description:
    'Plataforma profissional para avaliação e análise de uniformidade de sistemas de irrigação, com cálculos de CUD e CUC em tempo real.',
  keywords: [
    'irrigação',
    'agricultura',
    'avaliação de irrigação',
    'Avalia Irriga',
    'CUD',
    'CUC',
    'uniformidade de irrigação',
    'sistema de irrigação',
  ],
  authors: [{ name: 'Avalia Irriga Team' }],
  creator: 'Avalia Irriga',
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
        className={`antialiased`}
        suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
