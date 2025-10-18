import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://facoding.elixcode.com"),
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
  authors: [{ name: "Faraz Aghababayi", url: "https://facoding.elixcode.com" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://facoding.elixcode.com",
    siteName: "FaCoding — Portfolio",
    title: "Faraz Aghababayi — Full-Stack Developer",
    description:
      "Full-stack developer: .NET Core, React/Next.js, ERP/Inventory, QR/Barcode, integrations.",
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
    // بعد از گرفتن کد از Search Console اینو پر کن:
    // google: "paste-your-google-site-verification-code-here"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
            url: "https://facoding.elixcode.com",
            sameAs: [
              "https://www.linkedin.com/in/farazaghababayi",
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
              "Inventory",
              "QR",
              "Barcode",
              "Tailwind CSS",
              "Vue.js",
              "Node.js",
              "Python",
            ],
            image: "https://facoding.elixcode.com/images/profile.png",
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
            url: "https://facoding.elixcode.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://facoding.elixcode.com/?q={search_term_string}",
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
