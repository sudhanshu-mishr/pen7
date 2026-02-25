import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'penin-default-secret-key-12345';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = getDb();
    const user = db.prepare('SELECT id, email, username, avatar, bio, role FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
