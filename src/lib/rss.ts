/**
 * RSS Feed Parser — steinbachonline.com
 *
 * 구조:
 *   <title>          기사 제목
 *   <link>           기사 URL  (slug 추출 가능)
 *   <pubDate>        발행일 (RFC 822)
 *   <dc:creator>     작성자
 *   <description>    HTML (첫 번째 <img> = featured_image, 나머지 = 본문 요약)
 *   <guid>           link와 동일
 *
 * 카테고리 엔드포인트:
 *   /rss/local-news  /rss/national-news  /rss/local-sports
 *   /rss/ag-news     /rss/community      /rss/sponsored
 *   /rss/funeral-announcements           /rss/all
 *
 * 이미지 CDN: dht7q8fif4gks.cloudfront.net
 *
 * TODO: 연동 시 Next.js `next.config.ts` images.remotePatterns에
 *       dht7q8fif4gks.cloudfront.net 추가 필요
 */

// RSS 카테고리 → Article.category 매핑
export const RSS_CATEGORY_MAP: Record<string, string> = {
  'local-news': 'local-news',
  'national-news': 'national-news',
  'local-sports': 'sports',
  'ag-news': 'ag-news',
  'community': 'community',
  'sponsored': 'sponsored',
  'funeral-announcements': 'funeral',
  'all': 'all',
};

export interface RssArticle {
  title: string;
  slug: string;
  link: string;
  author: string;
  published_at: string;
  category: string;
  featured_image: string | null;
  summary: string;    // description에서 HTML 제거한 첫 200자
  content_html: string; // description 원본 HTML
}

// ——— 내부 헬퍼 ———

/** description HTML에서 첫 번째 img src 추출 */
function extractImage(descHtml: string): string | null {
  const match = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/** description HTML → 순수 텍스트 (img 제거, style/script 블록 제거, 태그 strip) */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** link URL에서 slug 추출:  /articles/{slug} → {slug} */
function extractSlug(link: string): string {
  const match = link.match(/\/articles\/([^/?#]+)/);
  return match ? match[1] : link.split('/').pop() ?? '';
}

/** XML <item> 요소 → RssArticle */
function parseItem(item: Element, category: string): RssArticle {
  const get = (tag: string) =>
    item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';

  const link = get('link');
  const descHtml = get('description');

  return {
    title: get('title'),
    slug: extractSlug(link),
    link,
    author: get('dc:creator'),
    published_at: new Date(get('pubDate')).toISOString(),
    category,
    featured_image: extractImage(descHtml),
    summary: htmlToText(descHtml).slice(0, 220),
    content_html: descHtml,
  };
}

// ——— 공개 API ———

const BASE = 'https://steinbachonline.com/rss';

/**
 * RSS 피드를 파싱해 RssArticle[] 반환
 *
 * @param category  RSS_CATEGORY_MAP의 키 (기본값: 'local-news')
 * @param limit     반환할 최대 개수 (기본값: 20)
 *
 * ISR용: Next.js fetch cache 옵션을 외부에서 주입받는 구조
 * 실제 연동 시 Next.js page/route에서 호출:
 *   const articles = await fetchRssFeed('local-news', 20);
 */
export async function fetchRssFeed(
  category: keyof typeof RSS_CATEGORY_MAP = 'local-news',
  limit = 20,
  fetchOptions?: RequestInit,
): Promise<RssArticle[]> {
  const url = `${BASE}/${category}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // 1분 ISR
    ...fetchOptions,
  });

  if (!res.ok) {
    console.error(`[RSS] fetch failed: ${res.status} ${url}`);
    return [];
  }

  const xmlText = await res.text();

  // Node.js 환경 — DOMParser 없음 → 정규식 파싱
  const items = parseXmlItems(xmlText);
  const mappedCategory = RSS_CATEGORY_MAP[category] ?? category;

  return items.slice(0, limit).map((raw) => {
    const descHtml = raw.description;
    const link = raw.link;
    return {
      title: raw.title,
      slug: extractSlug(link),
      link,
      author: raw.creator,
      published_at: new Date(raw.pubDate).toISOString(),
      category: mappedCategory,
      featured_image: extractImage(descHtml),
      summary: htmlToText(descHtml).slice(0, 220),
      content_html: descHtml,
    };
  });
}

// ——— 외부 RSS 피드 ———

/**
 * 외부 RSS URL (BBC, Reuters 등) → RssArticle[]
 * description 내 img 없을 경우 <media:thumbnail url="..."> 추출
 */
export async function fetchExternalRss(
  url: string,
  limit = 32,
  defaultSource = 'Reuters',
): Promise<RssArticle[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: RssArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;
    let i = 0;

    while ((match = itemRegex.exec(xml)) !== null && i < limit) {
      const block = match[1];
      const descHtml = getCdata(block, 'description') || getTag(block, 'description');
      const link = getTag(block, 'link') || getTag(block, 'guid');

      // BBC: <media:thumbnail url="..."/>  Guardian: <media:content url="..." medium="image"/>
      const thumbMatch = block.match(/<media:(?:thumbnail|content)[^>]+url=["']([^"']+)["']/i);
      const thumbnail = thumbMatch ? thumbMatch[1] : null;

      const rawTitle = getCdata(block, 'title') || getTag(block, 'title');
      const title = rawTitle.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();

      let pubIso = new Date().toISOString();
      try { pubIso = new Date(getTag(block, 'pubDate')).toISOString(); } catch { /* ignore */ }

      items.push({
        title,
        slug: extractSlug(link) || String(i),
        link,
        author: getTag(block, 'dc:creator') || defaultSource,
        published_at: pubIso,
        category: 'international',
        featured_image: extractImage(descHtml) || thumbnail,
        summary: htmlToText(descHtml).slice(0, 220),
        content_html: descHtml,
      });
      i++;
    }

    return items;
  } catch {
    return [];
  }
}

/**
 * slug로 단건 기사 조회 — 카테고리별 피드 병렬 fetch
 * /rss/all (3000+ items) 대신 6개 카테고리를 병렬로 가져와 빠르게 검색
 * 관련 기사도 함께 반환 (같은 카테고리 우선, 최대 relatedLimit개)
 */
const SEARCH_CATEGORIES = [
  'local-news', 'national-news', 'local-sports',
  'ag-news', 'community', 'sponsored',
] as const;

export async function fetchArticleBySlug(
  slug: string,
  relatedLimit = 4,
): Promise<{ article: RssArticle | null; related: RssArticle[] }> {
  // 6개 카테고리 병렬 fetch (각 20개씩, slug 탐색에 충분)
  const feeds = await Promise.all(
    SEARCH_CATEGORIES.map((cat) => fetchRssFeed(cat, 20)),
  );
  const allArticles = feeds.flat();

  const article = allArticles.find((a) => a.slug === slug) ?? null;
  if (!article) return { article: null, related: [] };

  // 같은 카테고리 우선, 없으면 전체에서 채움
  const sameCat = allArticles.filter(
    (a) => a.slug !== slug && a.category === article.category,
  );
  const others = allArticles.filter(
    (a) => a.slug !== slug && a.category !== article.category,
  );
  const related = [...sameCat, ...others].slice(0, relatedLimit);

  return { article, related };
}

/**
 * 키워드 검색 — 6개 카테고리 병렬 fetch 후 제목+요약 텍스트 매칭
 * funeral 제외, 모든 결과는 "News" 카테고리로 통합
 */
export async function searchArticles(
  query: string,
  limit = 30,
): Promise<RssArticle[]> {
  if (!query.trim()) return [];

  const feeds = await Promise.all(
    SEARCH_CATEGORIES.map((cat) => fetchRssFeed(cat, 20)),
  );
  const allArticles = feeds.flat();

  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const matched = allArticles.filter((a) => {
    const text = `${a.title} ${a.summary}`.toLowerCase();
    return keywords.every((kw) => text.includes(kw));
  });

  // 중복 slug 제거
  const seen = new Set<string>();
  const unique = matched.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });

  return unique.slice(0, limit);
}

// 외부 RSS 소스 목록
export const EXTERNAL_RSS_SOURCES = {
  'bbc-world':      'https://feeds.bbci.co.uk/news/world/rss.xml',
  'bbc-us':         'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
  'guardian-world': 'https://www.theguardian.com/world/rss',
} as const;

/** Node.js용 XML 정규식 파서 (DOMParser 미사용) */
interface RawItem {
  title: string;
  link: string;
  description: string;
  creator: string;
  pubDate: string;
}

function parseXmlItems(xml: string): RawItem[] {
  const items: RawItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title:       getTag(block, 'title'),
      link:        getTag(block, 'link'),
      description: getCdata(block, 'description') || getTag(block, 'description'),
      creator:     getTag(block, 'dc:creator'),
      pubDate:     getTag(block, 'pubDate'),
    });
  }

  return items;
}

function getTag(block: string, tag: string): string {
  const safeTag = tag.replace(':', '\\:');
  const m = block.match(new RegExp(`<${safeTag}[^>]*>([\\s\\S]*?)<\\/${safeTag}>`, 'i'));
  return m ? m[1].trim() : '';
}

function getCdata(block: string, tag: string): string {
  const safeTag = tag.replace(':', '\\:');
  const m = block.match(new RegExp(`<${safeTag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${safeTag}>`, 'i'));
  return m ? m[1].trim() : '';
}
