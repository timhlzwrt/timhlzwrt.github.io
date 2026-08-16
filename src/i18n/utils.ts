import { DEFAULT_LOCALE, LOCALES, type Locale } from "./content";

/** Reads the locale out of a pathname. `/de/...` is German, everything else English. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(segment ?? "")
    ? (segment as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Builds a path for a locale. English is unprefixed (`/about/`), German is
 * prefixed (`/de/about/`). Always returns a trailing slash to match the
 * `trailingSlash: "always"` config and avoid a Pages redirect.
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return clean ? `${prefix}/${clean}/` : `${prefix}/`;
}

/** The same page in the other language, for the switcher and hreflang tags. */
export function alternatePath(locale: Locale, pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if ((LOCALES as readonly string[]).includes(segments[0] ?? "")) segments.shift();
  return localePath(locale, segments.join("/"));
}

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "de" : "en");
