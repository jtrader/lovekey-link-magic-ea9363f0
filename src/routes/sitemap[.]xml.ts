import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://lovekeylink.com";

// Each child sitemap is registered here. Add a new entry (and its
// corresponding sitemap-*.xml route) as the site grows.
const CHILD_SITEMAPS = ["sitemap-pages.xml"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString();

        const sitemaps = CHILD_SITEMAPS.map((name) =>
          [
            `  <sitemap>`,
            `    <loc>${BASE_URL}/${name}</loc>`,
            `    <lastmod>${now}</lastmod>`,
            `  </sitemap>`,
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...sitemaps,
          `</sitemapindex>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
