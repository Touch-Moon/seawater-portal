import { createClient } from './server';
import type { Article, Event, WeatherData, Feature, SiteConfig, Business, Classified } from '@/types';

const siteKey = process.env.NEXT_PUBLIC_SITE_KEY!;

// ========== 사이트 설정 ==========

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_configs')
    .select('*')
    .eq('site_key', siteKey)
    .single();
  return data;
}

// ========== 기사 ==========

export async function getTrendingArticles(options?: {
  limit?: number;
  category?: string;
}): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select('*')
    .eq('site_id', siteKey)
    .order('views', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select('*')
    .eq('site_id', siteKey)
    .order('published_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('site_id', siteKey)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('site_id', siteKey)
    .eq('slug', slug)
    .single();
  return data;
}

// ========== 이벤트 ==========

export async function getEvents(limit = 10): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteKey)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('site_id', siteKey)
    .eq('slug', slug)
    .single();
  return data;
}

// ========== 날씨 ==========

export async function getWeatherData(): Promise<WeatherData | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('weather_data')
    .select('*')
    .eq('site_id', siteKey)
    .single();
  return data;
}

// ========== 피처 ==========

export async function getFeatures(): Promise<Feature[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('features')
    .select('*')
    .eq('site_id', siteKey)
    .eq('is_active', true);
  return data ?? [];
}

export async function getFeatureBySlug(slug: string): Promise<Feature | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('features')
    .select('*')
    .eq('site_id', siteKey)
    .eq('slug', slug)
    .single();
  return data;
}

// ========== 비즈니스 디렉토리 ==========

export async function getBusinesses(category?: string): Promise<Business[]> {
  const supabase = await createClient();
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('site_id', siteKey)
    .order('name', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data ?? [];
}

// ========== 생활정보 (Buy & Sell) ==========

export async function getClassifieds(category?: string): Promise<Classified[]> {
  const supabase = await createClient();
  let query = supabase
    .from('classifieds')
    .select('*')
    .eq('site_id', siteKey)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data ?? [];
}
