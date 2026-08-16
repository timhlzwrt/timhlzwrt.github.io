// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://me.tjh.li",

  // GitHub Pages serves `de/index.html` at `/de/` and 301-redirects `/de` to
  // it. Being explicit keeps links, canonicals and the sitemap agreeing with
  // each other and avoids a redirect on every nav click.
  trailingSlash: "always",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      // English lives at `/`, German at `/de/`. No `/en/` prefix.
      prefixDefaultLocale: false,
    },
  },

  // `/about/` was a real page in an earlier version of this site and briefly
  // went live; its content is now the #about section. Keep the URL working.
  redirects: {
    "/about/": "/#about",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
