import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingHeader } from "@/components/floating-header";
import { CompareProvider } from "@/context/compare-context";
import { StoreDataProvider } from "@/context/store-data-context";
import { CompareBar } from "@/components/compare-bar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LaunchCelebrationTracker } from "@/components/launch-celebration-tracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthLab – Apps & Deals",
  description: "Discover and launch apps and deals from startups on GrowthLab.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Apps & Deals",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F7377" },
    { media: "(prefers-color-scheme: dark)", color: "#14b8a6" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CompareProvider>
            <StoreDataProvider>
          <Suspense fallback={<div className="h-24" />}>
            <FloatingHeader />
          </Suspense>
          <div className="mobile-nav-spacer">{children}</div>
          <CompareBar />
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
          <LaunchCelebrationTracker />
            </StoreDataProvider>
        </CompareProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { border: "1px solid hsl(var(--border))" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
