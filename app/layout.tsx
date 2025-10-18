import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  /* همون قبلی شما */
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
        <Script id="sanitize-dom" strategy="beforeInteractive">
          {`
            try {
              const html = document.documentElement;
              const body = document.body;
              // کلاس‌های ناخواستهٔ افزونه‌ها (اگر خودت مدیریت نمی‌کنی)
              ["rtl-enabled"].forEach(c => {
                if (html.classList.contains(c) && !window.__APP_MANAGES_HTML_CLASS__) {
                  html.classList.remove(c);
                }
              });
              // اتربیوت‌های تزریقی معروف (Grammarly و امثالهم)
              const killAttrs = ["data-gr-ext-installed","data-new-gr-c-s-check-loaded"];
              killAttrs.forEach(a => {
                if (html.hasAttribute(a)) html.removeAttribute(a);
                if (body && body.hasAttribute(a)) body.removeAttribute(a);
              });
            } catch {}
          `}
        </Script>
      </head>
      {/* مهم: رو body هم suppressHydrationWarning بده */}
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-gray-800 text-gray-200 selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
