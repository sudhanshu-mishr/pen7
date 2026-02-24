import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables if they exist, but don't rely on them
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded defaults for zero-config startup
const JWT_SECRET = process.env.JWT_SECRET || 'penin-default-secret-key-12345';
const DB_PATH = process.env.DB_PATH || './bookbloom.db';
const PORT = 3000;

// Initialize Database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    username TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    content TEXT NOT NULL,
    preview_content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Seed Data
const seedData = () => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    const insertUser = db.prepare('INSERT INTO users (email, username, password, bio) VALUES (?, ?, ?, ?)');
    insertUser.run('elara@example.com', 'ElaraVance', hashedPassword, 'Fantasy author and dreamer.');
    insertUser.run('julian@example.com', 'JulianBlack', hashedPassword, 'Sci-fi enthusiast and tech writer.');
    insertUser.run('sarah@example.com', 'SarahWoods', hashedPassword, 'Romance novelist exploring the woods.');
    
    const insertBook = db.prepare(`
      INSERT INTO books (author_id, title, genre, description, content, preview_content, cover_image, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published')
    `);
    
    const content = `
      <h2>Chapter 1: The Awakening</h2>
      <p>The stars were different tonight. They pulsed with a rhythmic, violet light that Elara had never seen before. She stood on the balcony of the High Tower, her fingers tracing the cold stone of the railing.</p>
      <p>In the distance, the Whispering Woods were silent. Too silent. Usually, the nocturnal creatures of Aethelgard would be in full chorus by now, but tonight, even the wind seemed to hold its breath.</p>
      <p>"They are coming," a voice whispered behind her.</p>
      <p>Elara turned to see Master Kaelen standing in the doorway, his silver robes shimmering in the starlight. His face was etched with a worry she had never seen in all her years of training.</p>
      <p>"Who, Master?" she asked, though she already knew the answer. The legends had spoken of this night for a thousand years.</p>
      <p>"The Void-Walkers," he replied, his voice barely audible. "The seal has broken."</p>
      <p>Elara felt a chill run down her spine. The Void-Walkers were not just a myth. They were the reason the High Tower had been built. They were the reason she had been born with the mark of the Sun-Soul.</p>
      <p>She looked down at her right palm, where a faint, golden sigil was beginning to glow. It was warm, almost burning. The power she had spent her life trying to control was finally waking up.</p>
      <p>"What do we do?" she asked, her voice steadying.</p>
      <p>Kaelen stepped onto the balcony, his eyes fixed on the horizon. "We fight, Elara. We fight until the last star fades."</p>
    `;

    insertBook.run(1, 'The Sun-Soul Chronicles', 'Fantasy', 'A young mage discovers her destiny as the world falls into darkness.', content, content, 'https://picsum.photos/seed/fantasy/600/900');
    insertBook.run(2, 'Neon Shadows', 'Sci-Fi', 'In a city of eternal night, one hacker finds the light.', content, content, 'https://picsum.photos/seed/scifi/600/900');
    insertBook.run(3, 'Whispers in the Rain', 'Romance', 'Two strangers meet under a shared umbrella and change everything.', content, content, 'https://picsum.photos/seed/romance/600/900');
    insertBook.run(1, 'The Void Gate', 'Fantasy', 'The sequel to Sun-Soul Chronicles.', content, content, 'https://picsum.photos/seed/void/600/900');
    insertBook.run(2, 'Circuit Hearts', 'Sci-Fi', 'Can an AI learn to love?', content, content, 'https://picsum.photos/seed/ai/600/900');
  }
};

seedData();

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // --- API Routes ---
  app.post('/api/auth/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (email, username, password) VALUES (?, ?, ?)');
      const info = stmt.run(email, username, hashedPassword);
      
      const token = jwt.sign({ id: info.lastInsertRowid, email, username }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ id: info.lastInsertRowid, email, username });
    } catch (err: any) {
      res.status(400).json({ error: 'Email or username already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ id: user.id, email: user.email, username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/books', (req, res) => {
    const books = db.prepare(`
      SELECT b.*, u.username as author_name,
      (SELECT AVG(rating) FROM reviews WHERE book_id = b.id) as rating_avg,
      (SELECT COUNT(*) FROM reviews WHERE book_id = b.id) as review_count
      FROM books b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC
    `).all();
    res.json(books);
  });

  app.post('/api/books', (req, res) => {
    const { author_id, title, genre, description, content, cover_image } = req.body;
    const preview_content = content.substring(0, 3000);
    const stmt = db.prepare(`
      INSERT INTO books (author_id, title, genre, description, content, preview_content, cover_image, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published')
    `);
    const info = stmt.run(author_id, title, genre, description, content, preview_content, cover_image);
    res.json({ id: info.lastInsertRowid });
  });

  app.get('/api/books/:id', (req, res) => {
    const book = db.prepare(`
      SELECT b.*, u.username as author_name 
      FROM books b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.id = ?
    `).get(req.params.id);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
  });

  app.get('/api/reviews/:bookId', (req, res) => {
    const reviews = db.prepare(`
      SELECT r.*, u.username 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.bookId);
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { book_id, user_id, rating, comment } = req.body;
    const stmt = db.prepare('INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)');
    stmt.run(book_id, user_id, rating, comment);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Explicitly serve index.html for SPA fallback in dev
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`pen.in server running at http://localhost:${PORT}`);
  });
}

startServer();
