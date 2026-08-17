export const GH_USER = "abdelkabirouadoukou";

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  homepage: string | null;
  stargazersCount: number;
  topics: string[];
  isPinned: boolean;
}

export interface GitHubData {
  followers: number;
  publicRepos: number;
  repos: GitHubRepo[];
}

interface RawRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  fork: boolean;
  topics?: string[];
}

interface RawUser {
  followers: number;
  public_repos: number;
}

const GH_API = "https://api.github.com";
const GH_PROFILE = `https://github.com/${GH_USER}`;
const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "abdelkabir.me",
};

const FALLBACK: GitHubData = {
  followers: 145,
  publicRepos: 81,
  repos: [],
};

const TTL_MS = 20 * 60 * 1000;
const MAX_REPOS = 8;

let cached: { data: GitHubData; fetchedAt: number } | null = null;

const EMOJI_RE = /[\p{Extended_Pictographic}\u{FE0F}]/gu;

function cleanDescription(desc: string | null): string | null {
  if (!desc) return null;
  return desc
    .replace(EMOJI_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mapRepo(r: RawRepo, pinned: Set<string>): GitHubRepo {
  return {
    name: r.name,
    description: cleanDescription(r.description),
    language: r.language,
    htmlUrl: r.html_url,
    homepage: r.homepage,
    stargazersCount: r.stargazers_count,
    topics: r.topics ?? [],
    isPinned: pinned.has(r.name),
  };
}

function parsePinnedSlugs(html: string): string[] {
  const start = html.indexOf("js-pinned-items-reorder-list");
  if (start === -1) return [];
  const segment = html.slice(start, start + 20000);
  const regex = new RegExp(`href="/${GH_USER}/([A-Za-z0-9_.-]+)"`, "g");
  const slugs: string[] = [];
  const seen = new Set<string>();
  for (const match of segment.matchAll(regex)) {
    const slug = match[1];
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

async function fetchPinnedSlugs(): Promise<string[]> {
  const res = await fetch(GH_PROFILE, { headers: { "User-Agent": GH_USER } });
  if (!res.ok) return [];
  return parsePinnedSlugs(await res.text());
}

async function fetchRepoDetail(slug: string): Promise<RawRepo | null> {
  const res = await fetch(`${GH_API}/repos/${GH_USER}/${slug}`, { headers: GH_HEADERS });
  if (!res.ok) return null;
  return (await res.json()) as RawRepo;
}

export async function fetchGithubData(): Promise<GitHubData> {
  const now = Date.now();
  if (cached && now - cached.fetchedAt < TTL_MS) return cached.data;

  try {
    const [userRes, reposRes, pinned] = await Promise.all([
      fetch(`${GH_API}/users/${GH_USER}`, { headers: GH_HEADERS }),
      fetch(
        `${GH_API}/users/${GH_USER}/repos?type=source&sort=updated&per_page=9`,
        { headers: GH_HEADERS },
      ),
      fetchPinnedSlugs().catch(() => [] as string[]),
    ]);

    const user = userRes.ok ? ((await userRes.json()) as RawUser) : null;
    const reposRaw = reposRes.ok ? ((await reposRes.json()) as RawRepo[]) : [];
    const list = Array.isArray(reposRaw) ? reposRaw.filter((r) => !r.fork) : [];
    const listByName = new Map(list.map((r) => [r.name, r]));
    const pinnedSet = new Set(pinned);

    const missingPinned = [...pinnedSet].filter((slug) => !listByName.has(slug));
    const pinnedDetails = await Promise.all(missingPinned.map(fetchRepoDetail));

    const combined = new Map(listByName);
    for (const detail of pinnedDetails) {
      if (detail?.name) combined.set(detail.name, detail);
    }

    const ordered = [...combined.values()].sort((a, b) => {
      const ap = pinnedSet.has(a.name) ? 0 : 1;
      const bp = pinnedSet.has(b.name) ? 0 : 1;
      return ap - bp || b.stargazers_count - a.stargazers_count;
    });

    const data: GitHubData = {
      followers: user?.followers ?? FALLBACK.followers,
      publicRepos: user?.public_repos ?? FALLBACK.publicRepos,
      repos: ordered.slice(0, MAX_REPOS).map((r) => mapRepo(r, pinnedSet)),
    };
    cached = { data, fetchedAt: now };
    return data;
  } catch (err) {
    console.warn("[x] github fetch failed, using cached or fallback data:", err);
    if (cached) return cached.data;
    return FALLBACK;
  }
}
