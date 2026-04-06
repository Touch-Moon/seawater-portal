import { createBrowserClient } from '@supabase/ssr';

/**
 * 환경변수 유효성 확인 — 플레이스홀더 또는 미설정 감지
 * .env.local이 올바르게 설정돼 있는지 런타임에 체크한다.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return (
    url.startsWith('https://') &&
    !url.includes('your-project-id') &&
    key.length > 20
  );
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'portal' } }
  );
}
