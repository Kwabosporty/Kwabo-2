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
  name: string;
  image: string;
  votes: number;
  percentage: number;
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
}
