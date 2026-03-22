export const CATEGORIES = [
  { key: 'local-news', label: 'Local News' },
  { key: 'sports', label: 'Sports' },
  { key: 'community', label: 'Community' },
  { key: 'business', label: 'Business' },
] as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/weather', label: 'Weather' },
  { href: '/events', label: 'Events' },
  { href: '/listen', label: 'Listen' },
  { href: '/directory', label: 'Directory' },
  { href: '/classifieds', label: 'Classifieds' },
] as const;

export const REVALIDATE = {
  news: 60,
  weather: 300,
  events: 300,
  features: 3600,
  directory: 3600,
} as const;
