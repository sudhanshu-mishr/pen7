import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const book = db.prepare(`
    SELECT b.*, u.username as author_name
    FROM books b
    JOIN users u ON b.author_id = u.id
    WHERE b.id = ?
  `).get(id);

  if (book) {
    return NextResponse.json(book);
  } else {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }
}
