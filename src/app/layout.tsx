import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunbathing Calculator — Safe Sun Exposure Time by Skin Type & SPF",
  description:
    "Calculate your maximum safe sun exposure time based on your Fitzpatrick skin type, SPF sunscreen, and real-time UV index. Free online tool.",
  keywords: [
    "sunbathing calculator",
    "sun exposure time",
    "UV index calculator",
    "SPF calculator",
    "safe sun time",
    "sunburn calculator",
    "Fitzpatrick skin type",
    "UV protection",
  ],
  alternates: {
    canonical: "https://calcsuite.app",
  },
  openGraph: {
    title: "Sunbathing Calculator — Safe Sun Exposure Time by Skin Type & SPF",
    description:
      "Calculate your maximum safe sun exposure time based on skin type, SPF, and UV index.",
    type: "website",
    locale: "en_US",
    siteName: "Sunbathing Calculator",
  },
  twitter: {
    card: "summary",
    title: "Sunbathing Calculator",
    description:
      "Calculate your maximum safe sun exposure time based on skin type, SPF, and UV index.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long can I stay in the sun without sunscreen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your skin type and the current UV index. Fair skin (Type I) can burn in as little as 10 minutes under high UV, while darker skin (Type V-VI) has significantly more natural protection. Use a sunbathing calculator with SPF set to 1 to estimate your safe time.",
      },
    },
    {
      "@type": "Question",
      name: "What does SPF actually mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SPF stands for Sun Protection Factor. The number indicates how much longer you can stay in the sun compared to unprotected skin. SPF 30 means you can stay out roughly 30 times longer. Reapply every 2 hours for best results.",
      },
    },
    {
      "@type": "Question",
      name: "How does skin type affect sun exposure time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Fitzpatrick scale classifies skin into six types. Type I (very fair, always burns) has the lowest natural tolerance, while Type VI (deeply pigmented, never burns) has the highest. Your skin type determines your base safe exposure time before UV and SPF adjustments.",
      },
    },
    {
      "@type": "Question",
      name: "What UV index is dangerous?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UV index 1-2 is low risk. At 3-5 (moderate), unprotected skin can burn in 30-45 minutes. At 6-7 (high), reduce midday exposure. At 8-10 (very high), seek shade and wear sunscreen. Above 11 (extreme), avoid prolonged outdoor exposure.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is a sunbathing calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sunbathing calculators provide estimates based on skin type, SPF, and UV index. Real-world factors like cloud cover, altitude, water reflection, and individual sensitivity can affect results. Always treat results as guidelines and err on the side of caution.",
      },
    },
    {
      "@type": "Question",
      name: "Should I avoid the sun completely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — moderate sun exposure is beneficial for vitamin D production. The goal is to enjoy the sun safely. Know your limits based on your skin type, use sunscreen when needed, seek shade during peak hours (10 AM to 4 PM), and monitor the UV index.",
      },
    },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sunbathing Calculator",
  description:
    "Calculate your maximum safe sun exposure time based on skin type, SPF sunscreen, and UV index.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-2636014626530848" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
