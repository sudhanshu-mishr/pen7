import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const books = db.prepare(`
    SELECT b.*, u.username as author_name,
    (SELECT AVG(rating) FROM reviews WHERE book_id = b.id) as rating_avg,
    (SELECT COUNT(*) FROM reviews WHERE book_id = b.id) as review_count
    FROM books b
    JOIN users u ON b.author_id = u.id
    WHERE b.status = 'published'
    ORDER BY b.created_at DESC
  `).all();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  try {
    const { author_id, title, genre, description, content, cover_image } = await request.json();

    if (!author_id || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const preview_content = content.substring(0, 3000);
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO books (author_id, title, genre, description, content, preview_content, cover_image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published')
    `);

    const info = stmt.run(author_id, title, genre, description, content, preview_content, cover_image);

    return NextResponse.json({ id: info.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
