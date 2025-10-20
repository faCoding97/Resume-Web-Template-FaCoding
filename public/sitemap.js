sitemap.js; // app/sitemap.js
export default function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://facoding.elixflare.com";

  // اگر صفحات دیگری اضافه کردی، همین‌جا لیست کن (مثلاً: "fa", "resume")
  const routes = ["" /* "fa", "resume" */];

  const now = new Date();

  return routes.map((path) => {
    const url = path ? `${base}/${path}` : `${base}/`;
    return {
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path ? 0.8 : 1.0,
    };
  });
}
