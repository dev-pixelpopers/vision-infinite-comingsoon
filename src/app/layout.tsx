import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "Vision Infinite is coming soon. Leave your details and we will contact you within 24 hours.";

export const metadata: Metadata = {
  title: "Vision Infinite — Coming Soon",
  description: DESCRIPTION,
  // Placeholder page: keep it out of search results until launch.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Vision Infinite — Coming Soon",
    description: DESCRIPTION,
    siteName: "Vision Infinite",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Fonts are loaded via @font-face in src/styles/contact.css.
            When the licensed self-hosted files land, replace this with
            <link rel="preload" as="font" type="font/woff2" href="/fonts/…" crossOrigin="" /> */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <noscript>
          {/* Without JS the preloader never lifts and the reveals never fire. */}
          <style>{`.reveal{transform:none!important}.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
