import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { book_id, user_id, rating, comment } = await request.json();

    if (!book_id || !user_id || !rating) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare('INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)');
    stmt.run(book_id, user_id, rating, comment);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
