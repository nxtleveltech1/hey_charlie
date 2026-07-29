import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { siteConfig } from "@/lib/content/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const siteUrl = siteConfig.canonicalUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hey Charlie Charters | Private Boat Charters in Cape Town",
    template: "%s | Hey Charlie Charters",
  },
  description:
    "Private boat charters from the V&A Waterfront, Cape Town. Sundowner cruises, whale watching, deep-sea fishing, crayfish diving and coastal day trips along the Atlantic Seaboard and Cape Peninsula.",
  keywords: [
    "Cape Town boat charter",
    "whale watching Cape Town",
    "sundowner cruise",
    "fishing charter South Africa",
    "crayfish diving",
    "private yacht hire",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Hey Charlie Charters",
    locale: "en_ZA",
    url: siteUrl,
    images: [
      {
        url: "/images/sundown-cruise-hero.png",
        alt: "Hey Charlie Charters — private boat charters from the V&A Waterfront, Cape Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hey Charlie",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch {}
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        >
          <ThemeProvider>
            <AnalyticsProvider>
              {children}
              <PwaProvider />
            </AnalyticsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
