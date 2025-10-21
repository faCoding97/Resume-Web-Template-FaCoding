import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://facoding.elixflare.com"),
  title: "Faraz Aghababayi — Full-Stack Developer (Next.js, .NET Core)",
  description:
    "Portfolio & resume of Faraz Aghababayi (FaCoding). Full-stack developer specialized in .NET Core, React/Next.js, ERP/Inventory, QR/Barcode, and integrations.",
  keywords: [
    "Faraz Aghababayi",
    "FaCoding",
    "Full-Stack Developer",
    "Next.js",
    ".NET Core",
    "React",
    "ERP",
    "Inventory",
    "QR",
    "Barcode",
  ],
  authors: [
    { name: "Faraz Aghababayi", url: "https://facoding.elixflare.com" },
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://facoding.elixflare.com",
    siteName: "FaCoding — Portfolio",
    title: "Faraz Aghababayi — Full-Stack Developer",
    description:
      "Full-stack developer: .NET Core, React/Next.js/Vue.js, ERP/Inventory/BPMS, QR/Barcode, integrations.",
    images: [
      {
        url: "/images/profile.png",
        width: 1200,
        height: 630,
        alt: "Faraz Aghababayi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faraz Aghababayi — Full-Stack Developer",
    description:
      "Portfolio & resume — .NET Core, React/Next.js, ERP/Inventory, QR/Barcode.",
    images: ["/images/profile.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: `dKQzs1JM_VAihmAWs_4w86bKV9GGaqnpIiJzsWKCEqg`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1f2937",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Pre-hydration sanitize (همون که داشتی) */}
        <Script id="sanitize-dom" strategy="beforeInteractive">
          {`
            try {
              const html = document.documentElement;
              const body = document.body;
              ["rtl-enabled"].forEach(c => {
                if (html.classList.contains(c) && !window.__APP_MANAGES_HTML_CLASS__) {
                  html.classList.remove(c);
                }
              });
              const killAttrs = ["data-gr-ext-installed","data-new-gr-c-s-check-loaded"];
              killAttrs.forEach(a => {
                if (html.hasAttribute(a)) html.removeAttribute(a);
                if (body && body.hasAttribute(a)) body.removeAttribute(a);
              });
            } catch {}
          `}
        </Script>

        {/* JSON-LD: Person */}
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Faraz Aghababayi",
            alternateName: ["FaCoding"],
            url: "https://facoding.elixflare.com",
            sameAs: [
              "https://www.linkedin.com/in/farazaghababayi",
              "https://github.com/faCoding97",
              "https://facoding.elixflare.com",
              "https://www.instagram.com/Faraz_aghababayi",
              // اضافه کن: GitHub/Twitter/StackOverflow/Medium/Dev.to
              // "https://github.com/<your-username>",
              // "https://twitter.com/<your-handle>",
              // "https://stackoverflow.com/users/<id>",
            ],
            jobTitle: "Full-Stack Developer",
            knowsAbout: [
              "Next.js",
              "React",
              ".NET Core",
              "Entity Framework",
              "SQL Server",
              "ERP",
              "BPMS",
              "Inventory",
              "QR",
              "Barcode",
              "Tailwind CSS",
              "Vue.js",
              "Node.js",
              "Python",
              "API Integrations",
              "AI Services",
              "UX/UI Design",
              "JavaScript",
              "TypeScript",
              "Java",
              "Unity",
            ],
            image: "https://facoding.elixflare.com/images/profile.png",
          })}
        </Script>

        {/* JSON-LD: WebSite */}
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FaCoding — Portfolio",
            url: "https://facoding.elixflare.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://facoding.elixflare.com/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-gray-800 text-gray-200 selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
