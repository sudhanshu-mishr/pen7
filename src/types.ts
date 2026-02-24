export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
}

export interface Book {
  id: number;
  author_id: number;
  author_name: string;
  title: string;
  genre: string;
  description: string;
  cover_image?: string;
  content: string;
  preview_content: string;
  status: 'draft' | 'published';
  created_at: string;
  rating_avg?: number;
  review_count?: number;
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}
