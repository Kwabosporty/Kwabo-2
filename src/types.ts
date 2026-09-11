export interface MatchTickerItem {
  id: string;
  sport: 'football' | 'basketball' | 'motorsport' | 'combat';
  sportIcon?: string;
  homeTeam: string;
  homeScore?: number | string;
  awayTeam: string;
  awayScore?: number | string;
  homeLogo?: string;
  awayLogo?: string;
  gameState: string; // e.g., "88'", "Q4", "Lap 50"
  isLive: boolean;
  competition?: string;
}

export interface StandingTeam {
  pos: number;
  team: string;
  code: string;
  logo: string;
  color: string;
  played: number;
  mp: number; // match points or matches played
  pts: number;
  trend: 'up' | 'down' | 'same';
}

export interface CommentaryItem {
  id: string;
  minute?: string;
  type: 'general' | 'red_card' | 'yellow_card' | 'goal' | 'sub';
  text: string;
  highlight?: boolean;
}

export interface PollOption {
  id: string;
  poll_id?: string;
  name: string;
  image?: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  category?: string;
  total_votes: number;
  options: PollOption[];
  created_at?: string;
  expires_at?: string | null;
  is_active?: boolean;
}

export interface FixtureItem {
  id: string;
  date: string;
  time: string;
  competition: string;
  homeTeam: string;
  homeCode: string;
  homeLogo: string;
  awayTeam: string;
  awayCode: string;
  awayLogo: string;
  venue?: string;
  odds?: string;
}

export interface ArticleCard {
  id: string;
  category: string;
  categoryType: 'preview' | 'transfer' | 'opinion' | 'f1' | 'breaking';
  categoryColor: string; // cyan, red, yellow, lime
  title: string;
  subtitle?: string;
  image: string;
  author?: string;
  authorBio?: string;
  content?: string;
  readTime?: string;
}

export type BlogCategoryFilter = 'ALL' | 'TRANSFER NEWS' | 'TACTICAL ANALYSIS' | 'MATCH REPORTS' | 'OPINION';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryFilter: BlogCategoryFilter;
  categoryColor: string; // e.g. '#00E5FF', '#A3E635', '#EF4444', '#FACC15'
  categoryBg: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  commentsCount: number;
  featured?: boolean;
  content?: string;
  authorBio?: string;
}

// -------------------------------------------------------------
// SUPABASE ADMIN SCHEMA & DASHBOARD TYPES
// -------------------------------------------------------------
export type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'AUTHOR';

export type PostType =
  | 'NEWS'
  | 'TRANSFER'
  | 'ANALYSIS'
  | 'MATCH_REPORT'
  | 'OPINION'
  | 'news'
  | 'transfer'
  | 'analysis'
  | 'match_report'
  | 'opinion';

export type PostStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'draft'
  | 'published'
  | 'scheduled';

export const DEFAULT_EEAT_AUTHOR_BIO =
  'Kwabo Sports is a premier sports digital platform dedicated to delivering real-time match reports, transfer breaking news, and in-depth tactical analysis across global sports. Learn more on our About Us page or subscribe to Our YouTube Channel for daily live updates.';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  post_count: number;
  created_at: string;
}

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  category_color: string;
  post_type: PostType;
  status: PostStatus;
  is_featured: boolean; // "Pin as Front-Page Hero Post"
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  author_bio?: string;
  views: number;
  view_count?: number; // Alias requested by prompt
  read_time: string;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export type Post = AdminPost;

export interface AdminProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: AdminRole;
  avatar_url: string;
  created_at: string;
}

export type Profile = AdminProfile;
export type AdminUser = AdminProfile;

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string; // e.g., 'POST_CREATED', 'POST_UPDATED', 'POST_DELETED', 'CATEGORY_CREATED', 'CATEGORY_DELETED', 'SITE_SETTINGS_UPDATED', 'AUTH_LOGIN'
  target_type: 'post' | 'category' | 'setting' | 'auth';
  target_id: string;
  target_title: string;
  ip_address: string;
  timestamp: string;
  details: string;
}

export type AuditLog = AdminAuditLog;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'live' | 'audit' | 'post' | 'system';
}

export interface AdminDashboardStats {
  total_posts: number;
  drafts_pending: number;
  active_categories: number;
  total_views: number;
  today_views: number;
  last_sync_time?: string;
  cron_status?: string;
}

export interface SiteSettings {
  score_ticker_enabled: boolean;
  ticker_speed: 'slow' | 'normal' | 'fast';
  pinned_hero_post_id: string;
  maintenance_mode: boolean;
  site_title: string;
  editorial_email: string;
}
