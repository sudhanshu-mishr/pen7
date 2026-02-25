import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// Define the database path. On Render, you should set DB_PATH to a persistent location.
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'bookbloom.db');

class DB {
  private static instance: Database.Database;

  private constructor() {}

  public static getInstance(): Database.Database {
    if (!DB.instance) {
      console.log(`Initializing database at ${DB_PATH}`);
      DB.instance = new Database(DB_PATH);
      DB.instance.pragma('journal_mode = WAL');

      // Initialize schema
      DB.initSchema();
      // Seed data
      DB.seedData();
    }
    return DB.instance;
  }

  private static initSchema() {
    const db = DB.instance;
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
  }

  private static seedData() {
    const db = DB.instance;
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;

    if (userCount.count === 0) {
      console.log('Seeding database...');
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

      console.log('Database seeded successfully.');
    }
  }
}

// Export a singleton instance getter
export const getDb = () => DB.getInstance();
