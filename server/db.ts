import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

// Connect to Turso Cloud SQLite database
const db = createClient({
  url: process.env.TURSO_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// Initialize database schema
export const initDb = async () => {
  try {
    // Create Orders table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Order Items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    // Create Menu Items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        customizable INTEGER DEFAULT 0,
        options TEXT,
        bestseller INTEGER DEFAULT 0,
        available INTEGER DEFAULT 1
      )
    `);

    console.log('Turso Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Turso DB:', err);
  }
};

export default db;
