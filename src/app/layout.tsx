import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';
import AppSnackbar from '@/components/AppSnackbar';
import AppCardDetail from '@/components/AppCardDetail';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Duel Cards - Card Marketplace',
  description: 'Marketplace para troca de cartas criado por Augusto Rodrigues',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Providers>
          {children}
          <AppSnackbar />
          <AppCardDetail />
        </Providers>
      </body>
    </html>
  );
}
