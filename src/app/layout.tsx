import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "Vision infinie is coming soon. Leave your details and we will contact you within 24 hours.";

export const metadata: Metadata = {
  title: "Vision infinie — Coming Soon",
  description: DESCRIPTION,
  // Placeholder page: keep it out of search results until launch.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Vision infinie — Coming Soon",
    description: DESCRIPTION,
    siteName: "Vision infinie",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ded6c7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Both faces are self-hosted and declared by hand in
            src/styles/contact.css, so without these they are not discovered
            until the stylesheet has been fetched and parsed. `crossOrigin=""`
            is required even same-origin — fonts are always fetched in CORS
            mode, and without it the preload is discarded and refetched. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/fonts/Valturin-Regular.woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/fonts/Jost-Variable-latin.woff2"
          crossOrigin=""
        />
        <noscript>
          {/* Without JS the preloader never lifts and the reveals never fire. */}
          <style>{`.reveal{transform:none!important}.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
