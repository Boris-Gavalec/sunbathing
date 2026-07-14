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
  metadataBase: new URL("https://calcsuite.app"),
  title: {
    default: "CalcSuite — Free Online Calculators",
    template: "%s | CalcSuite",
  },
  description:
    "Free, fast online calculators for health and education — safe sun exposure, daily calories, BMI, and GPA. No sign-up, no fluff, just answers.",
  keywords: [
    "online calculators",
    "free calculators",
    "sunbathing calculator",
    "calorie calculator",
    "TDEE calculator",
    "BMR calculator",
    "UV index calculator",
    "SPF calculator",
    "BMI calculator",
    "body mass index",
    "GPA calculator",
    "grade calculator",
    "college GPA",
    "body fat calculator",
  ],
  alternates: {
    canonical: "https://calcsuite.app",
  },
  openGraph: {
    title: "CalcSuite — Free Online Calculators",
    description:
      "Free, fast online calculators — from safe sun exposure to daily calorie targets. No sign-up, no fluff, just answers.",
    type: "website",
    locale: "en_US",
    siteName: "CalcSuite",
    url: "https://calcsuite.app",
  },
  twitter: {
    card: "summary",
    title: "CalcSuite — Free Online Calculators",
    description:
      "Free, fast online calculators — from safe sun exposure to daily calorie targets.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CalcSuite",
  url: "https://calcsuite.app",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
