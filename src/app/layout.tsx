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
    default: "CalcSuite: Free Online Calculators for Health, Money & More",
    template: "%s | CalcSuite",
  },
  description:
    "Free, fast online calculators for health, money, study and everyday maths, covering BMI, calories, loans, mortgages, percentages, and dates. No sign-up, just answers.",
  keywords: [
    "online calculators",
    "free calculators",
    "sunbathing calculator",
    "calorie calculator",
    "TDEE calculator",
    "BMI calculator",
    "body mass index",
    "water intake calculator",
    "pace calculator",
    "GPA calculator",
    "grade calculator",
    "loan calculator",
    "EMI calculator",
    "mortgage calculator",
    "savings goal calculator",
    "tip calculator",
    "discount calculator",
    "percentage calculator",
    "age calculator",
    "unit converter",
    "date difference calculator",
  ],
  alternates: {
    canonical: "https://calcsuite.app",
  },
  openGraph: {
    title: "CalcSuite: Free Online Calculators",
    description:
      "Free, fast online calculators for health, money, study and everyday maths. No sign-up, no fluff, just answers.",
    type: "website",
    locale: "en_US",
    siteName: "CalcSuite",
    url: "https://calcsuite.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcSuite: Free Online Calculators",
    description:
      "Free, fast online calculators for health, money, study and everyday maths.",
  },
  robots: {
    index: true,
    follow: true,
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
        {/* Google tag (gtag.js) — kept as Google's verbatim snippet on purpose */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0TDBM57DMP"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-0TDBM57DMP');`,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-2636014626530848" />
        {/* Google AdSense (Auto ads) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2636014626530848"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
