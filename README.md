# Neural Resume — Next.js + Tailwind + TS

A single-page portfolio/resume with a neural-network canvas background, hover-typing cards, QR code generation & download, and lightweight animations. 100% frontend (App Router).

## ✨ Features

- **Neural Background (Canvas):** Nodes and connecting lines with a subtle “mouse-repel” effect (DPI-aware and efficient).
- **Profile Photo Ring:** Circular avatar with two glowing tracers that start at 12 o’clock, spin in opposite directions, meet at the bottom, then fade (CSS-only + initials fallback).
- **Personal Info:** LinkedIn + Email (mailto), live domain QR, and PNG download.
- **Portfolio Cards:** Grid with **type-on hover**, 3D tilt, aurora glow, dynamic favicon, and lightweight RTT status (Fast / OK / Slow).
- **About & Skills:** “Read more” About card, Skills with tabs, and an **ordered Journey** reflecting your learning/usage order.
- **SEO & Sharing:** Next.js Metadata API, Open Graph/Twitter tags, `robots.txt`, and `sitemap.xml`.
- **Fully Responsive:** Mobile-first layout, smooth hover/scroll effects, tasteful glow.

---

## 🚀 Quickstart

````bash
npm install
npm run dev
# open http://localhost:3000


```bash
npm install
npm run dev
# open http://localhost:3000


app/
  layout.tsx            # متادیتا/SEO، <html> و <body>
  page.tsx              # صفحه‌ی اصلی (Hero, Sections, Portfolio, Footer)
  globals.css           # Tailwind و CSS سفارشی
components/
  BackgroundCanvas.tsx  # پس‌زمینه‌ی عصبی (Canvas)
  ProfilePhoto.tsx      # عکس پروفایل + ردیاب‌های نوری + تیلت
  PersonalInfo.tsx      # LinkedIn, Email, QR + Copy/Compose/Download
  PortfolioGrid.tsx     # کارت‌های پرتفولیو با تایپ روی هاور + RTT + Tilt
  TypingText.tsx        # کامپوننت تایپ تدریجی
  Section.tsx           # با انیمیشن ورود (framer-motion)
  Hero.tsx              # اسم، امضای SVG، Focus rotator، cloud chips
  AboutSection.tsx      # کارت About با Read more
  SkillsSection.tsx     # تب‌بندی مهارت‌ها + Journey ordered
public/
  images/profile.(png|jpg)  # تصویر پروفایل
  robots.txt
  sitemap.xml
data.json               # همه‌ی داده‌های قابل‌ویرایش
tailwind.config.ts
tsconfig.json
next.config.mjs
package.json
````
