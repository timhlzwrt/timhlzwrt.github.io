// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://me.tjh.li",

  // GitHub Pages serves `about/index.html` at `/about/` and 301-redirects
  // `/about` to it. Being explicit here keeps links, canonicals and the
  // sitemap agreeing with each other and avoids a redirect on every nav click.
  trailingSlash: "always",

  vite: {
    plugins: [tailwindcss()],
  },
});
