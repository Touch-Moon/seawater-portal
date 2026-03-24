'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { RssArticle } from '@/lib/rss'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const TABS = [
  { id: 'top',       label: 'Top News',  href: '/news',           dropdown: true  },
  { id: 'local',     label: 'Local',     href: '/news/local',     dropdown: false },
  { id: 'national',  label: 'National',  href: '/news/national',  dropdown: false },
  { id: 'sports',    label: 'Sports',    href: '/news/sports',    dropdown: false },
  { id: 'ag',        label: 'Ag News',   href: '/news/ag',        dropdown: false },
  { id: 'community', label: 'Community', href: '/news/community', dropdown: false },
]

// ── Mock fallback data ─────────────────────────────────────────

const GRID_ARTICLES = [
  { id: 1, title: 'City council approves $2.4M infrastructure plan for downtown roads',       source: 'Steinbach Online', image: 'https://picsum.photos/seed/news1/400/225', href: '/news/1' },
  { id: 2, title: 'Local hockey team advances to provincial semifinals after dramatic win',   source: 'Steinbach Online', image: 'https://picsum.photos/seed/news2/400/225', href: '/news/2' },
  { id: 3, title: 'Spring flooding risk elevated along Red River corridor, officials warn',   source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/news3/400/225', href: '/news/3' },
  { id: 4, title: 'New agri-food processing facility to bring 120 jobs to southeast MB',     source: 'Manitoba Co-operator', image: 'https://picsum.photos/seed/news4/400/225', href: '/news/4' },
]

const LIST_ARTICLES = [
  { id: 5,  title: 'RCMP investigate fatal collision on PTH 12 south of Steinbach',           breaking: true,  href: '/news/5'  },
  { id: 6,  title: 'Province announces $8M expansion of Steinbach Regional Secondary',        breaking: false, href: '/news/6'  },
  { id: 7,  title: 'Hanover school division reports record enrollment for 2025–26',           breaking: false, href: '/news/7'  },
  { id: 8,  title: 'Crop progress report: seeding at 34% across southeast region',            breaking: false, href: '/news/8'  },
  { id: 9,  title: 'Steinbach fire department responds to apartment blaze on Main St',        breaking: false, href: '/news/9'  },
  { id: 10, title: 'Southeast MB sees warmest March on record, forecasters say',              breaking: false, href: '/news/10' },
  { id: 11, title: 'Niverville introduces new curbside composting program this summer',       breaking: false, href: '/news/11' },
  { id: 12, title: 'Local business association launches Buy Local spring campaign',           breaking: false, href: '/news/12' },
]

const DROPDOWN_ITEMS = [
  {
    id: 'top',
    label: 'Top News',
    shortLabel: 'Top',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
        <rect x="2" y="2" width="14" height="3" rx="1" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="7" width="14" height="3" rx="1" fill="currentColor" opacity="0.75"/>
        <rect x="2" y="12" width="14" height="3" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'latest',
    label: 'Latest News',
    shortLabel: 'Latest',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 5v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'trending',
    label: 'Trending',
    shortLabel: 'Trending',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
        <rect x="2" y="11" width="3" height="5" rx="1" fill="currentColor"/>
        <rect x="7" y="7" width="3" height="9" rx="1" fill="currentColor"/>
        <rect x="12" y="3" width="3" height="13" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
]

// ── Sports mock ────────────────────────────────────────────────
const SPORTS_FEATURED = {
  id: 101, title: 'Local hockey team advances to provincial semifinals after dramatic overtime win',
  source: 'Steinbach Online', image: 'https://picsum.photos/seed/sports1/700/340', href: '/news/sports/1',
}
const SPORTS_TEXT_LIST = [
  { id: 108, title: 'RCMP investigate brawl at youth hockey tournament in Steinbach',         breaking: false, href: '/news/sports/8'  },
  { id: 109, title: 'Southeast MB golf league announces 2026 season schedule and prizes',     breaking: false, href: '/news/sports/9'  },
  { id: 110, title: 'Niverville Nighthawks to host provincial curling qualifiers this March', breaking: false, href: '/news/sports/10' },
  { id: 111, title: 'Steinbach track & field club opens spring registration for all ages',    breaking: false, href: '/news/sports/11' },
]
const SPORTS_THUMB_LIST = [
  { id: 102, title: 'Steinbach Pistons clinch first place with shutout victory over rivals',  source: 'Steinbach Online', image: 'https://picsum.photos/seed/sports2/266/154', href: '/news/sports/2' },
  { id: 103, title: 'Southeast MB curling club sends two rinks to provincials this weekend',  source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/sports3/266/154', href: '/news/sports/3' },
  { id: 104, title: 'High school basketball finals set as Steinbach Regional takes top seed', source: 'Steinbach Online', image: 'https://picsum.photos/seed/sports4/266/154', href: '/news/sports/4' },
  { id: 105, title: 'Local swimming club captures 14 medals at regional championships',       source: 'Steinbach Online', image: 'https://picsum.photos/seed/sports5/266/154', href: '/news/sports/5' },
]

// ── Local mock ─────────────────────────────────────────────────
const LOCAL_ARTICLES = [
  { id: 301, title: 'City council approves $2.4M infrastructure plan for downtown roads',            source: 'Steinbach Online', image: 'https://picsum.photos/seed/local1/266/154', href: '/news/local/1' },
  { id: 302, title: 'RCMP investigate fatal collision on PTH 12 south of Steinbach',                 source: 'Steinbach Online', image: 'https://picsum.photos/seed/local2/266/154', href: '/news/local/2' },
  { id: 303, title: 'Province announces $8M expansion of Steinbach Regional Secondary School',        source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/local3/266/154', href: '/news/local/3' },
  { id: 304, title: 'Hanover school division reports record enrollment for 2025–26 academic year',    source: 'Steinbach Online', image: 'https://picsum.photos/seed/local4/266/154', href: '/news/local/4' },
  { id: 305, title: 'Steinbach fire department responds to apartment blaze on Main Street',           source: 'Steinbach Online', image: 'https://picsum.photos/seed/local5/266/154', href: '/news/local/5' },
  { id: 306, title: 'Southeast MB sees warmest March on record, Environment Canada forecasters say',  source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/local6/266/154', href: '/news/local/6' },
  { id: 307, title: 'Niverville introduces new curbside composting pilot program this summer',        source: 'Steinbach Online', image: 'https://picsum.photos/seed/local7/266/154', href: '/news/local/7' },
  { id: 308, title: 'Local business association launches Buy Local spring campaign across region',    source: 'Steinbach Online', image: 'https://picsum.photos/seed/local8/266/154', href: '/news/local/8' },
]

// ── National / International mock (32 articles = 4 pages × 8) ─
const NATIONAL_ARTICLES = [
  { id: 401, title: 'US Federal Reserve signals potential rate cuts as inflation cools to 2.4%',                          source: 'Associated Press', image: 'https://picsum.photos/seed/nat01/266/154', href: '/news/national/1'  },
  { id: 402, title: 'NATO allies commit to 3% GDP defense spending target at Brussels summit',                             source: 'Reuters',          image: 'https://picsum.photos/seed/nat02/266/154', href: '/news/national/2'  },
  { id: 403, title: 'UN climate report warns Arctic ice sheet melt accelerating beyond projections',                       source: 'BBC News',         image: 'https://picsum.photos/seed/nat03/266/154', href: '/news/national/3'  },
  { id: 404, title: 'White House announces sweeping new sanctions targeting Russian energy sector',                        source: 'AP News',          image: 'https://picsum.photos/seed/nat04/266/154', href: '/news/national/4'  },
  { id: 405, title: 'Global food prices rise for third consecutive month, UN World Food Programme warns',                  source: 'Reuters',          image: 'https://picsum.photos/seed/nat05/266/154', href: '/news/national/5'  },
  { id: 406, title: 'SpaceX Starship completes first fully successful orbital test flight and splashdown',                 source: 'CNN',              image: 'https://picsum.photos/seed/nat06/266/154', href: '/news/national/6'  },
  { id: 407, title: 'European Parliament passes landmark AI regulation act with broad bipartisan consensus',               source: 'The Guardian',     image: 'https://picsum.photos/seed/nat07/266/154', href: '/news/national/7'  },
  { id: 408, title: 'China GDP growth slows to 4.2% as property market downturn continues into second year',              source: 'Bloomberg',        image: 'https://picsum.photos/seed/nat08/266/154', href: '/news/national/8'  },
  { id: 409, title: 'Middle East ceasefire talks resume in Cairo with US mediators present',                              source: 'Reuters',          image: 'https://picsum.photos/seed/nat09/266/154', href: '/news/national/9'  },
  { id: 410, title: 'WHO member states reach agreement on global pandemic preparedness treaty',                            source: 'BBC News',         image: 'https://picsum.photos/seed/nat10/266/154', href: '/news/national/10' },
  { id: 411, title: 'UK economy slips into recession for second time in 18 months, data shows',                           source: 'Financial Times',  image: 'https://picsum.photos/seed/nat11/266/154', href: '/news/national/11' },
  { id: 412, title: 'Japan 7.4 magnitude earthquake triggers tsunami warning along Pacific coast',                         source: 'AP News',          image: 'https://picsum.photos/seed/nat12/266/154', href: '/news/national/12' },
  { id: 413, title: 'Amazon deforestation drops 45% in 2025 as enforcement operations intensify',                         source: 'The Guardian',     image: 'https://picsum.photos/seed/nat13/266/154', href: '/news/national/13' },
  { id: 414, title: 'OPEC+ agrees to extend production cuts through end of year to stabilize oil prices',                 source: 'Reuters',          image: 'https://picsum.photos/seed/nat14/266/154', href: '/news/national/14' },
  { id: 415, title: 'G7 leaders agree on joint AI governance framework and digital trade standards',                       source: 'Bloomberg',        image: 'https://picsum.photos/seed/nat15/266/154', href: '/news/national/15' },
  { id: 416, title: 'South Korea presidential election result triggers political realignment in region',                   source: 'CNN',              image: 'https://picsum.photos/seed/nat16/266/154', href: '/news/national/16' },
  { id: 417, title: 'Ukraine secures $18B military aid package ahead of summer offensive push',                            source: 'AP News',          image: 'https://picsum.photos/seed/nat17/266/154', href: '/news/national/17' },
  { id: 418, title: 'Taiwan Strait tensions rise as Chinese military conducts largest drills in a decade',                 source: 'Reuters',          image: 'https://picsum.photos/seed/nat18/266/154', href: '/news/national/18' },
  { id: 419, title: 'IMF warns of growing debt crisis risk in 25 emerging market economies',                              source: 'Financial Times',  image: 'https://picsum.photos/seed/nat19/266/154', href: '/news/national/19' },
  { id: 420, title: 'Arctic shipping route sees record cargo traffic as ice retreat opens new lanes',                      source: 'Bloomberg',        image: 'https://picsum.photos/seed/nat20/266/154', href: '/news/national/20' },
  { id: 421, title: 'WHO issues alert as H5N1 bird flu cases detected in multiple US dairy herds',                        source: 'BBC News',         image: 'https://picsum.photos/seed/nat21/266/154', href: '/news/national/21' },
  { id: 422, title: 'US-China high-level trade talks resume after 14-month breakdown',                                    source: 'Associated Press', image: 'https://picsum.photos/seed/nat22/266/154', href: '/news/national/22' },
  { id: 423, title: 'African Union launches $500B debt restructuring framework for member nations',                        source: 'Reuters',          image: 'https://picsum.photos/seed/nat23/266/154', href: '/news/national/23' },
  { id: 424, title: 'Global solar energy capacity hits 3 terawatts for first time in history',                            source: 'The Guardian',     image: 'https://picsum.photos/seed/nat24/266/154', href: '/news/national/24' },
  { id: 425, title: 'IMF world economic outlook: Global growth to hold at 3.1% despite trade headwinds',                 source: 'Bloomberg',        image: 'https://picsum.photos/seed/nat25/266/154', href: '/news/national/25' },
  { id: 426, title: 'North Korea test-fires intercontinental ballistic missile into Sea of Japan',                         source: 'AP News',          image: 'https://picsum.photos/seed/nat26/266/154', href: '/news/national/26' },
  { id: 427, title: 'US Supreme Court rules on landmark social media free speech case',                                    source: 'CNN',              image: 'https://picsum.photos/seed/nat27/266/154', href: '/news/national/27' },
  { id: 428, title: 'Greenland ice sheet loses record 1.2 trillion tons of ice in single melt season',                    source: 'BBC News',         image: 'https://picsum.photos/seed/nat28/266/154', href: '/news/national/28' },
  { id: 429, title: 'India overtakes Germany as world\'s fourth-largest economy, IMF data confirms',                     source: 'Reuters',          image: 'https://picsum.photos/seed/nat29/266/154', href: '/news/national/29' },
  { id: 430, title: 'UN water security summit warns 40% of global population faces water stress by 2040',                 source: 'The Guardian',     image: 'https://picsum.photos/seed/nat30/266/154', href: '/news/national/30' },
  { id: 431, title: 'International Space Station future in doubt as Russia announces 2028 withdrawal',                    source: 'Associated Press', image: 'https://picsum.photos/seed/nat31/266/154', href: '/news/national/31' },
  { id: 432, title: 'Global cybersecurity breach affects government systems in 17 countries simultaneously',              source: 'Financial Times',  image: 'https://picsum.photos/seed/nat32/266/154', href: '/news/national/32' },
]

// ── Sponsored mock ─────────────────────────────────────────────
const SPONSORED_ARTICLES = [
  { id: 501, title: 'Steinbach Dodge Chrysler: Spring clearance event — save up to $8,000',           source: 'Sponsored', image: 'https://picsum.photos/seed/sp1/266/154',  href: '/sponsored/1' },
  { id: 502, title: 'Park Manor Personal Care Home: Join our team — RN & HCA positions open',         source: 'Sponsored', image: 'https://picsum.photos/seed/sp2/266/154',  href: '/sponsored/2' },
  { id: 503, title: 'Affinity Credit Union: Lock in your mortgage rate before it rises again',        source: 'Sponsored', image: 'https://picsum.photos/seed/sp3/266/154',  href: '/sponsored/3' },
  { id: 504, title: 'Steinbach Co-op: Fresh local produce now available in-store and online',         source: 'Sponsored', image: 'https://picsum.photos/seed/sp4/266/154',  href: '/sponsored/4' },
  { id: 505, title: 'Red River Mutual: Protect what matters most — get a free home quote today',      source: 'Sponsored', image: 'https://picsum.photos/seed/sp5/266/154',  href: '/sponsored/5' },
  { id: 506, title: 'Jake Epp Library: Free summer reading program registration now open',            source: 'Sponsored', image: 'https://picsum.photos/seed/sp6/266/154',  href: '/sponsored/6' },
  { id: 507, title: 'Emerald Park Estates: New phase now selling — act fast, limited lots available', source: 'Sponsored', image: 'https://picsum.photos/seed/sp7/266/154',  href: '/sponsored/7' },
  { id: 508, title: 'Southeast Collegiate: Fall 2026 program enrollment open for adult learners',     source: 'Sponsored', image: 'https://picsum.photos/seed/sp8/266/154',  href: '/sponsored/8' },
]

// ── Community mock ─────────────────────────────────────────────
const COMMUNITY_ARTICLES = [
  { id: 201, title: 'Steinbach Mennonite Heritage Museum opens new permanent exhibit this spring', source: 'Steinbach Online', image: 'https://picsum.photos/seed/com1/400/225', href: '/news/community/1' },
  { id: 202, title: 'Annual community cleanup draws record 400 volunteers across Hanover region',   source: 'Steinbach Online', image: 'https://picsum.photos/seed/com2/400/225', href: '/news/community/2' },
  { id: 203, title: 'Jake Epp Library introduces new digital literacy program for seniors',          source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/com3/400/225', href: '/news/community/3' },
  { id: 204, title: 'Local churches partner to launch emergency housing fund for families',          source: 'Steinbach Online', image: 'https://picsum.photos/seed/com4/400/225', href: '/news/community/4' },
  { id: 205, title: 'Niverville farmers market kicks off season with 60 vendors registered',         source: 'Steinbach Online', image: 'https://picsum.photos/seed/com5/400/225', href: '/news/community/5' },
  { id: 206, title: 'Southeast region youth choir selected to perform at national festival in July', source: 'Steinbach Online', image: 'https://picsum.photos/seed/com6/400/225', href: '/news/community/6' },
  { id: 207, title: 'Steinbach fire department hosts free car seat inspection day this Saturday',    source: 'Steinbach Online', image: 'https://picsum.photos/seed/com7/400/225', href: '/news/community/7' },
  { id: 208, title: 'Community garden expansion project receives $25K provincial grant funding',     source: 'CBC Manitoba',     image: 'https://picsum.photos/seed/com8/400/225', href: '/news/community/8' },
]

// ── Filler articles — pad pages 2+ when RSS data runs short ───────────────
// Page 1은 항상 순수 RSS. Pages 2+부터 filler 사용. Mock 절대 1페이지 금지.
const TARGET_PAGES = 4

function toFillerRss(
  item: { title: string; source: string; image: string; href: string },
  idx: number
): RssArticle {
  const slug = `filler-${item.href.split('/').filter(Boolean).pop() ?? idx}`
  return {
    title:          item.title,
    slug,
    link:           item.href,
    author:         item.source,
    published_at:   new Date(Date.now() - idx * 28_800_000).toISOString(),
    category:       'news',
    featured_image: item.image,
    summary:        '',
    content_html:   '',
  }
}

// 카테고리별 filler 풀 — 각 탭/변형의 카테고리와 일치하는 mock 데이터 사용
const FILLER_LOCAL     = LOCAL_ARTICLES.map((a, i) =>     toFillerRss(a, i))
const FILLER_NATIONAL  = NATIONAL_ARTICLES.map((a, i) =>  toFillerRss(a, i))
const FILLER_COMMUNITY = COMMUNITY_ARTICLES.map((a, i) => toFillerRss(a, i))
const FILLER_SPONSORED = SPONSORED_ARTICLES.map((a, i) => toFillerRss(a, i))
// Sports: FEATURED(1) + THUMB_LIST(4) = 5 items (추가 페이지는 cycle)
const FILLER_SPORTS    = [
  toFillerRss({ title: SPORTS_FEATURED.title, source: SPORTS_FEATURED.source, image: SPORTS_FEATURED.image, href: SPORTS_FEATURED.href }, 0),
  ...SPORTS_THUMB_LIST.map((a, i) => toFillerRss(a, i + 1)),
]

function getFillerPool(variant: string): RssArticle[] {
  switch (variant) {
    case 'local':     return FILLER_LOCAL
    case 'national':  return FILLER_NATIONAL
    case 'community': return FILLER_COMMUNITY
    case 'sponsored': return FILLER_SPONSORED
    case 'sports':    return FILLER_SPORTS
    default:          return FILLER_NATIONAL  // default (Top News) / ag
  }
}

// ── Page sizes ─────────────────────────────────────────────────
const PS_DEFAULT = 12  // 4 grid + 8 list
const PS_THUMB   = 8   // thumb list variants
const PS_SPORTS  = 9   // 1 featured + 4 text + 4 thumb
const PS_COMM    = 8   // community grid

// ── RSS → display format helpers ───────────────────────────────
function toGridItem(a: RssArticle, i: number) {
  return {
    id: i,
    title: a.title,
    source: a.author || 'Steinbach Online',
    image: a.featured_image || `https://picsum.photos/seed/${encodeURIComponent(a.slug)}/400/225`,
    href: `/news/${a.slug}`,
  }
}

function toThumbItem(a: RssArticle, i: number) {
  return {
    id: i,
    title: a.title,
    source: a.author || 'Steinbach Online',
    image: a.featured_image || `https://picsum.photos/seed/${encodeURIComponent(a.slug)}/266/154`,
    href: `/news/${a.slug}`,
  }
}

// ── Props ──────────────────────────────────────────────────────
export interface CategoryArticles {
  top?:       RssArticle[]
  local?:     RssArticle[]
  national?:  RssArticle[]
  sports?:    RssArticle[]
  ag?:        RssArticle[]
  community?: RssArticle[]
  trending?:  RssArticle[]  // Supabase views DESC
}

interface NewsPanelProps {
  title?: string
  titleHref?: string
  icon?: string
  showCategoryTabs?: boolean
  variant?: 'default' | 'sports' | 'community' | 'local' | 'national' | 'sponsored'
  articles?: RssArticle[]
  categoryArticles?: CategoryArticles
}

export default function NewsPanel({
  title = 'News',
  titleHref = '/news',
  icon = '/ico-news.svg',
  showCategoryTabs = true,
  variant = 'default',
  articles,
  categoryArticles,
}: NewsPanelProps) {
  const { width } = useBreakpoint()
  const gridCount        = width < 880 ? 2 : width < 981 ? 3 : 4
  const listCount        = width < 880 ? 4 : width < 981 ? 5 : 8
  const useTabsMoreBtn   = width < 981  // ≤ 980px: hide tabs, show ... button

  const [activeTab, setActiveTab] = useState('top')
  const [currentPage, setCurrentPage] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSort, setActiveSort] = useState('top')
  const [dropdownPos, setDropdownPos] = useState<{ left?: number; right?: number }>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const topNewsBtnRef = useRef<HTMLButtonElement>(null)
  const moreTabBtnRef = useRef<HTMLButtonElement>(null)

  // ── Effective variant: tab-driven for Top News, prop for others ──
  const effectiveVariant = useMemo(() => {
    if (!showCategoryTabs) return variant
    const map: Record<string, typeof variant> = {
      community: 'community',
      national:  'national',
      local:     'local',
      sponsored: 'sponsored',
      sports:    'sports',
    }
    return map[activeTab] ?? 'default'
  }, [showCategoryTabs, activeTab, variant])

  // ── Current RSS base (tab-switched + sort-switched) ──
  const currentTabBase = useMemo<RssArticle[]>(() => {
    if (!showCategoryTabs) {
      // 하위 패널: trending 선택 시 categoryArticles.trending 우선 사용
      if (activeSort === 'trending' && categoryArticles?.trending?.length) {
        return categoryArticles.trending
      }
      return articles ?? []
    }
    // 메인 패널: Top 탭 + trending → Supabase views-ranked
    if (activeTab === 'top' && activeSort === 'trending' && categoryArticles?.trending?.length) {
      return categoryArticles.trending
    }
    const key = activeTab as keyof CategoryArticles
    return categoryArticles?.[key] ?? articles ?? []
  }, [showCategoryTabs, activeTab, activeSort, categoryArticles, articles])

  // ── Sorted articles ──
  const currentTabArticles = useMemo<RssArticle[]>(() => {
    const hash = (s: string) => s.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0)

    if (activeSort === 'top') {
      // 편집 인기순: 배열을 1/3 지점부터 회전 → Latest(최신순)와 1페이지 기사가 달라짐
      // (pageSize는 이 useMemo보다 아래 선언이므로 참조 금지)
      const n = currentTabBase.length
      if (n < 3) return [...currentTabBase].reverse()
      const offset = Math.floor(n / 3) // 48개 → 16, 36개 → 12, 12개 → 4
      return [...currentTabBase.slice(offset), ...currentTabBase.slice(0, offset)]
    }
    if (activeSort === 'latest') {
      // 순수 날짜 내림차순
      return [...currentTabBase].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )
    }
    if (activeSort === 'trending') {
      // Supabase views DESC 데이터가 있으면 그대로 사용
      if (categoryArticles?.trending?.length) return currentTabBase
      // 없는 패널 → 해시 기반 가짜 인기순
      return [...currentTabBase].sort((a, b) => hash('t' + b.slug) - hash('t' + a.slug))
    }
    return currentTabBase
  }, [currentTabBase, activeSort, categoryArticles?.trending?.length])

  const rssAvailable = currentTabArticles.length > 0

  // ── Page size ──
  // 소형 태블릿: 모든 variant → default (gridCount + listCount)
  const pageSize = useMemo(() => {
    if (useTabsMoreBtn)                   return gridCount + listCount
    if (effectiveVariant === 'sports')    return PS_SPORTS
    if (effectiveVariant === 'community') return PS_COMM
    if (effectiveVariant === 'default')   return PS_DEFAULT
    return PS_THUMB
  }, [useTabsMoreBtn, gridCount, listCount, effectiveVariant])

  // ── Extend RSS with filler to guarantee TARGET_PAGES pages ──
  // Page 1 = 순수 RSS (filler 절대 미사용). Pages 2+ = RSS 소진 후 filler 보충.
  // filler는 effectiveVariant 카테고리에 맞는 mock 데이터 사용.
  const extendedArticles = useMemo(() => {
    if (!rssAvailable) return currentTabArticles
    const minCount = pageSize * TARGET_PAGES
    if (currentTabArticles.length >= minCount) return currentTabArticles
    const needed = minCount - currentTabArticles.length
    const pool = getFillerPool(effectiveVariant)
    const filler = Array.from({ length: needed }, (_, i) => pool[i % pool.length])
    return [...currentTabArticles, ...filler]
  }, [rssAvailable, currentTabArticles, pageSize, effectiveVariant])

  // ── Total pages ──
  const totalPages = useMemo(() => {
    if (rssAvailable) return Math.ceil(extendedArticles.length / pageSize)
    // Mock fallbacks (RSS 없을 때)
    if (effectiveVariant === 'national')  return Math.ceil(NATIONAL_ARTICLES.length / PS_THUMB)
    if (effectiveVariant === 'local')     return Math.ceil(LOCAL_ARTICLES.length / PS_THUMB)
    if (effectiveVariant === 'sponsored') return Math.ceil(SPONSORED_ARTICLES.length / PS_THUMB)
    if (effectiveVariant === 'community') return Math.ceil(COMMUNITY_ARTICLES.length / PS_COMM)
    if (effectiveVariant === 'sports')    return 1
    return 4
  }, [rssAvailable, extendedArticles.length, pageSize, effectiveVariant])

  // ── Paginated slice ──
  const pageSlice = useMemo(() => {
    const offset = (currentPage - 1) * pageSize
    return extendedArticles.slice(offset, offset + pageSize)
  }, [currentPage, pageSize, extendedArticles])

  // ── goPage helper ──
  const goPage = (p: number) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))

  // ── Display data (RSS slice or mock fallback) ──

  // default / ag — gridCount: 3 on small tablet, 4 otherwise
  const displayGrid = rssAvailable
    ? pageSlice.slice(0, gridCount).map(toGridItem)
    : GRID_ARTICLES.slice(0, gridCount)
  const displayList = rssAvailable
    ? pageSlice.slice(gridCount, gridCount + listCount).map((a, i) => ({ id: i + gridCount, title: a.title, breaking: false, href: `/news/${a.slug}` }))
    : LIST_ARTICLES.slice(gridCount - 4, gridCount - 4 + listCount)

  // sports
  const displaySportsFeatured = rssAvailable && pageSlice[0]
    ? { ...SPORTS_FEATURED, title: pageSlice[0].title, image: pageSlice[0].featured_image || SPORTS_FEATURED.image, href: `/news/${pageSlice[0].slug}` }
    : SPORTS_FEATURED
  const displaySportsTextList = rssAvailable
    ? pageSlice.slice(1, 5).map((a, i) => ({ id: i + 1, title: a.title, breaking: false, href: `/news/${a.slug}` }))
    : SPORTS_TEXT_LIST
  const displaySportsThumbList = rssAvailable
    ? pageSlice.slice(5, 9).map(toThumbItem)
    : SPORTS_THUMB_LIST

  // local
  const displayLocalPaged = rssAvailable
    ? pageSlice.map(toThumbItem)
    : LOCAL_ARTICLES.slice((currentPage - 1) * PS_THUMB, currentPage * PS_THUMB)

  // national
  const displayNationalPaged = rssAvailable
    ? pageSlice.map(toThumbItem)
    : NATIONAL_ARTICLES.slice((currentPage - 1) * PS_THUMB, currentPage * PS_THUMB)

  // sponsored
  const displaySponsoredPaged = rssAvailable
    ? pageSlice.map(toThumbItem)
    : SPONSORED_ARTICLES.slice((currentPage - 1) * PS_THUMB, currentPage * PS_THUMB)

  // community
  const displayCommunityPaged = rssAvailable
    ? pageSlice.map(toGridItem)
    : COMMUNITY_ARTICLES.slice((currentPage - 1) * PS_COMM, currentPage * PS_COMM)

  // ── Outside click closes dropdown ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const clickedBtn = topNewsBtnRef.current?.contains(target) || moreTabBtnRef.current?.contains(target)
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !clickedBtn) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  // ── Measure dropdown position ──
  // •••  버튼: right 기준 (오른쪽 라인 맞춤)
  // Top News 버튼: left 기준 (왼쪽 라인 맞춤)
  useEffect(() => {
    const btn = useTabsMoreBtn ? moreTabBtnRef.current : topNewsBtnRef.current
    if (dropdownOpen && btn) {
      const panel = btn.closest('.news-panel') as HTMLElement | null
      if (panel) {
        const panelRect = panel.getBoundingClientRect()
        const btnRect   = btn.getBoundingClientRect()
        if (useTabsMoreBtn) {
          setDropdownPos({ right: panelRect.right - btnRect.right })
        } else {
          setDropdownPos({ left: btnRect.left - panelRect.left })
        }
      }
    }
  }, [dropdownOpen, useTabsMoreBtn])

  // ── Dropdown: focus first item + arrow key navigation ──
  useEffect(() => {
    if (!dropdownOpen || !dropdownRef.current) return
    const items = dropdownRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
    if (items.length > 0) items[0].focus()

    const handleKey = (e: KeyboardEvent) => {
      if (!dropdownRef.current) return
      const list = Array.from(dropdownRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      const idx = list.indexOf(document.activeElement as HTMLElement)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        list[(idx + 1) % list.length]?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        list[(idx - 1 + list.length) % list.length]?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [dropdownOpen])

  return (
    <div className="news-panel">

      {/* ── Header ── */}
      <div className="news-panel__header">

        {/* Icon + title */}
        <Link href={titleHref} className="news-panel__title-wrap">
          <span className="news-panel__icon" aria-hidden="true">
            <img src={icon} width={40} height={40} alt="" />
          </span>
          <div className="news-panel__title-text">
            {title}
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>

        {/* ── Tablet (≤980px): ... button only ── */}
        {useTabsMoreBtn ? (
          <div className="news-panel__tabs news-panel__tabs--more-only">
            <button
              ref={moreTabBtnRef}
              type="button"
              className={`news-panel__tab news-panel__tab--more${dropdownOpen ? ' news-panel__tab--active' : ''}`}
              aria-expanded={dropdownOpen}
              aria-label="More categories"
              onClick={() => setDropdownOpen(o => !o)}
            >
              •••
            </button>
          </div>
        ) : (
          /* Desktop: full tab bar */
          <div className="news-panel__tabs" role="tablist" aria-label={showCategoryTabs ? 'News categories' : 'Sort'}>
            {!showCategoryTabs ? (
              DROPDOWN_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSort === item.id}
                  className={`news-panel__tab${activeSort === item.id ? ' news-panel__tab--active' : ''}`}
                  onClick={() => { setActiveSort(item.id); setCurrentPage(1) }}
                >
                  {item.shortLabel}
                </button>
              ))
            ) : (
              TABS.map((tab) => (
                tab.dropdown ? (
                  <button
                    key={tab.id}
                    ref={topNewsBtnRef}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-expanded={dropdownOpen}
                    className={`news-panel__tab${activeTab === tab.id ? ' news-panel__tab--active' : ''}`}
                    onClick={() => {
                      if (activeTab !== tab.id) { setCurrentPage(1) }
                      setActiveTab(tab.id)
                      setDropdownOpen(o => !o)
                    }}
                  >
                    {DROPDOWN_ITEMS.find(d => d.id === activeSort)?.label ?? tab.label}
                    <svg
                      width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`news-panel__tab${activeTab === tab.id ? ' news-panel__tab--active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setCurrentPage(1)
                      setDropdownOpen(false)
                    }}
                  >
                    {tab.label}
                  </button>
                )
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Dropdown ── */}
      {dropdownOpen && (
        <div className="news-panel__dropdown" role="menu" ref={dropdownRef} style={dropdownPos}>
          {useTabsMoreBtn && !showCategoryTabs ? (
            // 태블릿 + 하위 패널: sort 옵션 (Top/Latest/Trending)
            DROPDOWN_ITEMS.map(item => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`news-panel__dropdown-item${activeSort === item.id ? ' news-panel__dropdown-item--active' : ''}`}
                onClick={() => {
                  setActiveSort(item.id)
                  setDropdownOpen(false)
                  setCurrentPage(1)
                }}
              >
                <span className="news-panel__dropdown-label">{item.label}</span>
                {activeSort === item.id && (
                  <svg aria-hidden="true" className="news-panel__dropdown-check" width="16" height="16" viewBox="0 0 16 16" fill="none" >
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))
          ) : useTabsMoreBtn && showCategoryTabs ? (
            // 태블릿 + 메인 패널: 카테고리 목록
            TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                role="menuitem"
                className={`news-panel__dropdown-item${activeTab === tab.id ? ' news-panel__dropdown-item--active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id)
                  setDropdownOpen(false)
                  setCurrentPage(1)
                }}
              >
                <span className="news-panel__dropdown-label">{tab.label}</span>
                {activeTab === tab.id && (
                  <svg aria-hidden="true" className="news-panel__dropdown-check" width="16" height="16" viewBox="0 0 16 16" fill="none" >
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))
          ) : (
            // 데스크탑: Top News sort 옵션 (아이콘 포함)
            DROPDOWN_ITEMS.map(item => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`news-panel__dropdown-item${activeSort === item.id ? ' news-panel__dropdown-item--active' : ''}`}
                onClick={() => {
                  setActiveSort(item.id)
                  setDropdownOpen(false)
                  setCurrentPage(1)
                }}
              >
                <span className="news-panel__dropdown-icon">{item.icon}</span>
                <span className="news-panel__dropdown-label">{item.label}</span>
                {activeSort === item.id && (
                  <svg aria-hidden="true" className="news-panel__dropdown-check" width="16" height="16" viewBox="0 0 16 16" fill="none" >
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* ── Body ── */}
      {useTabsMoreBtn ? (

        /* 소형 태블릿: 모든 variant → default (grid + list) 레이아웃 */
        <div className="news-panel__body">
          <div className="news-panel__grid">
            {displayGrid.map((article) => (
              <Link key={article.id} href={article.href} className="news-panel__card">
                <div className="news-panel__thumb-wrap">
                  <Image
                    className="news-panel__thumb"
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 671px) 42vw, (max-width: 980px) 30vw, 167px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="news-panel__card-info">
                  <p className="news-panel__card-title">{article.title}</p>
                  <span className="news-panel__card-source">{article.source}</span>
                </div>
              </Link>
            ))}
          </div>
          <ul className="news-panel__list">
            {displayList.map((article) => (
              <li key={article.id} className="news-panel__list-item">
                {article.breaking && <span className="news-panel__badge">Breaking</span>}
                <Link href={article.href} className="news-panel__list-link">{article.title}</Link>
              </li>
            ))}
          </ul>
        </div>

      ) : effectiveVariant === 'sports' ? (

        <div className="news-panel__body news-panel__body--sports">

          {/* Left: featured image + 4 text list */}
          <div className="news-panel__featured-col">
            <Link href={displaySportsFeatured.href} className="news-panel__featured">
              <Image
                className="news-panel__featured-img"
                src={displaySportsFeatured.image}
                alt={displaySportsFeatured.title}
                fill
                sizes="(max-width: 671px) 90vw, (max-width: 980px) 50vw, 350px"
                style={{ objectFit: 'cover' }}
              />
              <div className="news-panel__featured-overlay">
                <p className="news-panel__featured-title">{displaySportsFeatured.title}</p>
              </div>
            </Link>

            <ul className="news-panel__list">
              {displaySportsTextList.map((article) => (
                <li key={article.id} className="news-panel__list-item">
                  <Link href={article.href} className="news-panel__list-link">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: 4 thumb items */}
          <ul className="news-panel__list-thumb">
            {displaySportsThumbList.map((article) => (
              <li key={article.id} className="news-panel__list-thumb-item">
                <Link href={article.href} className="news-panel__list-thumb-link">
                  <div className="news-panel__list-thumb-info">
                    <p className="news-panel__list-thumb-title">{article.title}</p>
                    <span className="news-panel__list-thumb-source">{article.source}</span>
                  </div>
                  <Image
                    className="news-panel__list-thumb-img"
                    src={article.image}
                    alt={article.title}
                    width={133}
                    height={77}
                    sizes="(max-width: 671px) 30vw, 133px"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              </li>
            ))}
          </ul>

        </div>

      ) : effectiveVariant === 'local' ? (

        <div className="news-panel__body news-panel__body--thumb-grid">
          {displayLocalPaged.map((article) => (
            <div key={article.id} className="news-panel__list-thumb-item">
              <Link href={article.href} className="news-panel__list-thumb-link">
                <div className="news-panel__list-thumb-info">
                  <p className="news-panel__list-thumb-title">{article.title}</p>
                  <span className="news-panel__list-thumb-source">{article.source}</span>
                </div>
                <Image
                  className="news-panel__list-thumb-img"
                  src={article.image}
                  alt=""
                  width={133}
                  height={77}
                  sizes="(max-width: 671px) 30vw, 133px"
                  style={{ objectFit: 'cover' }}
                />
              </Link>
            </div>
          ))}
        </div>

      ) : effectiveVariant === 'national' ? (

        <div className="news-panel__body news-panel__body--thumb-grid">
          {displayNationalPaged.map((article) => (
            <div key={article.id} className="news-panel__list-thumb-item">
              <Link href={article.href} className="news-panel__list-thumb-link">
                <div className="news-panel__list-thumb-info">
                  <p className="news-panel__list-thumb-title">{article.title}</p>
                  <span className="news-panel__list-thumb-source">{article.source}</span>
                </div>
                <Image
                  className="news-panel__list-thumb-img"
                  src={article.image}
                  alt=""
                  width={133}
                  height={77}
                  sizes="(max-width: 671px) 30vw, 133px"
                  style={{ objectFit: 'cover' }}
                />
              </Link>
            </div>
          ))}
        </div>

      ) : effectiveVariant === 'sponsored' ? (

        <div className="news-panel__body news-panel__body--thumb-grid">
          {displaySponsoredPaged.map((article) => (
            <div key={article.id} className="news-panel__list-thumb-item">
              <Link href={article.href} className="news-panel__list-thumb-link">
                <div className="news-panel__list-thumb-info">
                  <p className="news-panel__list-thumb-title">{article.title}</p>
                  <span className="news-panel__list-thumb-source">{article.source}</span>
                </div>
                <Image
                  className="news-panel__list-thumb-img"
                  src={article.image}
                  alt=""
                  width={133}
                  height={77}
                  sizes="(max-width: 671px) 30vw, 133px"
                  style={{ objectFit: 'cover' }}
                />
              </Link>
            </div>
          ))}
        </div>

      ) : effectiveVariant === 'community' ? (

        <div className="news-panel__body">
          <div className="news-panel__grid news-panel__grid--community">
            {displayCommunityPaged.map((article) => (
              <Link key={article.id} href={article.href} className="news-panel__card">
                <div className="news-panel__thumb-wrap">
                  <Image
                    className="news-panel__thumb"
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 671px) 42vw, (max-width: 980px) 30vw, 167px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="news-panel__card-info">
                  <p className="news-panel__card-title">{article.title}</p>
                  <span className="news-panel__card-source">{article.source}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      ) : (

        /* default (Top News, Ag News) */
        <div className="news-panel__body">

          {/* Left: 2×2 image grid */}
          <div className="news-panel__grid">
            {displayGrid.map((article) => (
              <Link key={article.id} href={article.href} className="news-panel__card">
                <div className="news-panel__thumb-wrap">
                  <Image
                    className="news-panel__thumb"
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 671px) 42vw, (max-width: 980px) 30vw, 167px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="news-panel__card-info">
                  <p className="news-panel__card-title">{article.title}</p>
                  <span className="news-panel__card-source">{article.source}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right: text list */}
          <ul className="news-panel__list">
            {displayList.map((article) => (
              <li key={article.id} className="news-panel__list-item">
                {article.breaking && (
                  <span className="news-panel__badge">Breaking</span>
                )}
                <Link href={article.href} className="news-panel__list-link">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>

        </div>

      )}

      {/* ── Footer ── */}
      <div className="news-panel__footer">
        <button
          type="button"
          className="news-panel__footer-btn"
          aria-label="Previous"
          disabled={currentPage === 1}
          onClick={() => goPage(currentPage - 1)}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="news-panel__footer-label">
          <span className="news-panel__footer-more">{title} More</span>
          <span className="news-panel__footer-page">{currentPage} / {totalPages}</span>
        </div>

        <button
          type="button"
          className="news-panel__footer-btn"
          aria-label="Next"
          disabled={currentPage === totalPages}
          onClick={() => goPage(currentPage + 1)}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

    </div>
  )
}
