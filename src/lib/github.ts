/**
 * Build-time GitHub metadata.
 *
 * This runs once per build, not once per visitor: the numbers are baked into
 * the HTML, so the page needs no JavaScript to show them, and a visitor's browser
 * never talks to GitHub at all.
 * A scheduled rebuild keeps it current (see .github/workflows/deploy.yml).
 *
 * Every failure path is non-fatal. A rate limit or an offline build machine
 * costs the metadata column, not the deploy.
 */

import { profile, type Locale } from "~/i18n/content";

export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string | null;
  archived: boolean;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string | null;
  archived: boolean;
}

let cache: Map<string, RepoStats> | null = null;

export async function fetchRepoStats(): Promise<Map<string, RepoStats>> {
  // Astro renders pages in parallel; without this the same request goes out
  // once per page and burns the unauthenticated rate limit faster.
  if (cache) return cache;

  const stats = new Map<string, RepoStats>();

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": `${profile.domain}-build`,
  };

  // Set in CI automatically; raises the limit from 60/hr to 5000/hr.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.handle}/repos?per_page=100&sort=updated`,
      { headers, signal: AbortSignal.timeout(10_000) },
    );

    if (!res.ok) {
      console.warn(`[github] ${res.status} ${res.statusText}, building without repo metadata.`);
      cache = stats;
      return stats;
    }

    const repos = (await res.json()) as GitHubRepo[];
    for (const repo of repos) {
      stats.set(repo.name, {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        pushedAt: repo.pushed_at,
        archived: repo.archived,
      });
    }
    console.log(`[github] loaded metadata for ${stats.size} repos`);
  } catch (error) {
    console.warn(
      `[github] ${error instanceof Error ? error.message : error}, building without repo metadata.`,
    );
  }

  cache = stats;
  return stats;
}

/** "Feb 2026" / "Feb. 2026". Short enough for a column, precise enough to be useful. */
export function formatMonth(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
