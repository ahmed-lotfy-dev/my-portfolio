
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content?: string | null;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  readingTime: string;
  image?: string | null;
  featured: boolean;
  published: boolean;
  views: number;
  imageLink?: string | null;
}

export interface SyncResult {
  success: boolean;
  count: number;
  reconciled: number;
}
