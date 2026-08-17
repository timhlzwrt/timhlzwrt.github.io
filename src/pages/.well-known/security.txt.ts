import type { APIRoute } from "astro";
import { profile } from "~/i18n/content";

/**
 * Generated at build time rather than served from `public/`, so `Expires`
 * rolls forward on its own.
 *
 * RFC 9116 tells consumers to treat an expired file as invalid, and a static
 * one quietly lapses on a date nothing is watching. The nightly rebuild
 * (see .github/workflows/deploy.yml) keeps this window from ever closing.
 */
const MONTHS_VALID = 6;

export const GET: APIRoute = () => {
  const expires = new Date();
  expires.setUTCMonth(expires.getUTCMonth() + MONTHS_VALID);
  expires.setUTCHours(23, 59, 0, 0);

  const body =
    [
      `# ${profile.url}/.well-known/security.txt`,
      "# RFC 9116. If you found something, tell me and I will fix it.",
      "",
      `Contact: mailto:${profile.email}`,
      `Expires: ${expires.toISOString()}`,
      "Preferred-Languages: en, de",
      `Canonical: ${profile.url}/.well-known/security.txt`,
    ].join("\n") + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
