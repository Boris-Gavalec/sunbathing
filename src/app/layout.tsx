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
    default: "CalcSuite — Free Online Calculators for Health, Money & More",
    template: "%s | CalcSuite",
  },
  description:
    "Free, fast online calculators for health, money, study and everyday maths — BMI, calories, loans, mortgages, percentages, dates and more. No sign-up, just answers.",
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
    title: "CalcSuite — Free Online Calculators",
    description:
      "Free, fast online calculators for health, money, study and everyday maths. No sign-up, no fluff, just answers.",
    type: "website",
    locale: "en_US",
    siteName: "CalcSuite",
    url: "https://calcsuite.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcSuite — Free Online Calculators",
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
        <meta name="google-adsense-account" content="ca-pub-2636014626530848" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
