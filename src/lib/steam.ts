/**
 * Build-time "last played" from Steam.
 *
 * Same contract as src/lib/github.ts: one call per build, memoized, baked
 * into the footer, so a visitor's browser never contacts Steam and the
 * privacy table stays true as written. The nightly rebuild
 * (.github/workflows/deploy.yml) is what keeps it current, which is also why
 * the label says "last played" and not "now playing". Steam does expose live
 * in-game status via GetPlayerSummaries, but on a statically built page that
 * would only ever capture whatever was true at 06:17 UTC, so it is useless
 * here.
 *
 * Uses GetOwnedGames rather than the smaller, more obvious
 * GetRecentlyPlayedGames. Two reasons: every entry carries an explicit
 * `rtime_last_played`, so "most recent" is a sort rather than an assumption
 * about the order the API happens to return; and GetRecentlyPlayedGames only
 * covers a two-week window, so the line would vanish during any break rather
 * than just going quietly stale. The cost is a larger response, which is
 * irrelevant once a night at build time.
 *
 * Every failure path is non-fatal. No key, a rejected key, a private
 * profile, a rate limit or an offline build machine all cost the footer
 * line, not the deploy.
 */

import { profile } from "~/i18n/content";

export interface Game {
  name: string;
  appid: number;
  url: string;
}

interface SteamGame {
  appid?: number;
  name?: string;
  rtime_last_played?: number;
}

interface OwnedGamesResponse {
  response?: { game_count?: number; games?: SteamGame[] };
}

interface VanityResponse {
  response?: { success?: number; steamid?: string };
}

const API = "https://api.steampowered.com";

/** SteamID64s are 17 digits. Anything else is treated as a vanity URL name. */
const STEAM_ID64 = /^\d{17}$/;

/** `undefined` means "not fetched yet", `null` means "fetched, nothing to show". */
let cache: Game | null | undefined;

/**
 * Accepts either a SteamID64 or the vanity name from a profile URL
 * (steamcommunity.com/id/<name>), because the vanity name is the half most
 * people actually know. Returns null if it can't be resolved.
 */
async function resolveSteamId(key: string): Promise<string | null> {
  if (STEAM_ID64.test(profile.steam)) return profile.steam;

  const url = new URL(`${API}/ISteamUser/ResolveVanityURL/v1/`);
  url.search = new URLSearchParams({ key, vanityurl: profile.steam }).toString();

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    console.warn(`[steam] ${res.status} ${res.statusText} resolving "${profile.steam}".`);
    return null;
  }

  // success === 1 is a match; 42 is "no such vanity URL".
  const data = (await res.json()) as VanityResponse;
  if (data.response?.success !== 1 || !data.response.steamid) {
    console.warn(`[steam] no profile matches the vanity name "${profile.steam}".`);
    return null;
  }

  return data.response.steamid;
}

export async function fetchLastGame(): Promise<Game | null> {
  // Astro renders pages in parallel. Without this the requests go out once
  // per page, and a miss would be retried just as often.
  if (cache !== undefined) return cache;
  cache = null;

  const key = process.env.STEAM_API_KEY;
  if (!key) {
    console.warn("[steam] no STEAM_API_KEY, building without the last-played line.");
    return cache;
  }

  try {
    const steamid = await resolveSteamId(key);
    if (!steamid) return cache;

    const url = new URL(`${API}/IPlayerService/GetOwnedGames/v1/`);
    url.search = new URLSearchParams({
      key,
      steamid,
      // Names, not just appids. Free-to-play games are owned differently and
      // are left out by default, which would quietly skip half a library.
      include_appinfo: "1",
      include_played_free_games: "1",
    }).toString();

    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.warn(
        `[steam] ${res.status} ${res.statusText}, building without the last-played line.`,
      );
      return cache;
    }

    const data = (await res.json()) as OwnedGamesResponse;

    // A private profile is not an error: Steam answers 200 with an empty
    // `response` object. Game details have to be public for this to work.
    const games = data.response?.games;
    if (!games?.length) {
      console.warn(
        "[steam] no games returned (private profile, or game details not public), building without the last-played line.",
      );
      return cache;
    }

    // Explicit sort rather than trusting the response order. Games that have
    // never been launched report 0 and sort to the bottom on their own.
    const latest = games
      .filter((game) => game.name && game.appid && game.rtime_last_played)
      .sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))[0];

    if (!latest?.name || !latest.appid) {
      console.warn("[steam] nothing played yet, building without the last-played line.");
      return cache;
    }

    cache = {
      name: latest.name.trim(),
      appid: latest.appid,
      url: `https://store.steampowered.com/app/${latest.appid}/`,
    };
    console.log(`[steam] last played: ${cache.name}`);
  } catch (error) {
    console.warn(
      `[steam] ${error instanceof Error ? error.message : error}, building without the last-played line.`,
    );
  }

  return cache;
}
