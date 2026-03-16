import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universidad EAFIT",
  description: "English Course - Elementary 2 | Universidad EAFIT",
  keywords: ["Universidad EAFIT", "Idiomas EAFIT", "English Course", "Elementary 2"],
  authors: [{ name: "Universidad EAFIT" }],
  icons: {
    icon: "/logos/universidad-eafit-icon.svg",
    shortcut: "/logos/universidad-eafit-icon.svg",
    apple: "/logos/universidad-eafit-icon.svg",
  },
  openGraph: {
    title: "Universidad EAFIT",
    description: "English Course - Elementary 2",
    siteName: "Universidad EAFIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universidad EAFIT",
    description: "English Course - Elementary 2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
