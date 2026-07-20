import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ChatWidget from '@/components/chat/widget';
import ThemeProvider from '@/components/theme-provider';
import "./globals.css";

export const metadata: Metadata = {
  title: "UzTeam | Next-Generation IT Business Automation & AI Solutions",
  description: "UzTeam builds premium custom ERP, CRM, MRP systems and custom AI assistants to automate and scale your business.",
  openGraph: {
    title: "UzTeam | Next-Generation IT Business Automation & AI Solutions",
    description: "UzTeam builds premium custom ERP, CRM, MRP systems and custom AI assistants to automate and scale your business.",
    url: "https://uzteam.com",
    siteName: "UzTeam",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UzTeam | IT Business Automation",
    description: "Premium IT automation solutions and custom AI assistants.",
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
            <ChatWidget />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
