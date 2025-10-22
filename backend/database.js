import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'hotel.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Rooms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT UNIQUE NOT NULL,
      room_type TEXT NOT NULL,
      price_per_night REAL NOT NULL,
      capacity INTEGER NOT NULL,
      status TEXT DEFAULT 'available',
      description TEXT,
      amenities TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Guests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      id_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id INTEGER NOT NULL,
      room_id INTEGER NOT NULL,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'confirmed',
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guest_id) REFERENCES guests(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    )
  `);

  // Staff table
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    )
  `);

  // Housekeeping table
  db.exec(`
    CREATE TABLE IF NOT EXISTS housekeeping (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      staff_id INTEGER,
      status TEXT DEFAULT 'pending',
      task_type TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      notes TEXT,
      scheduled_date DATE NOT NULL,
      completed_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (staff_id) REFERENCES staff(id)
    )
  `);

  console.log('Database initialized successfully');
}

// Seed initial data
export function seedDatabase() {
  const roomCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  
  if (roomCount.count === 0) {
    const insertRoom = db.prepare(`
      INSERT INTO rooms (room_number, room_type, price_per_night, capacity, status, description, amenities)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const rooms = [
      ['101', 'Single', 80000, 1, 'available', 'Cozy single room with city view', 'WiFi,TV,AC'],
      ['102', 'Single', 80000, 1, 'available', 'Comfortable single room', 'WiFi,TV,AC'],
      ['201', 'Double', 120000, 2, 'available', 'Spacious double room with balcony', 'WiFi,TV,AC,Balcony'],
      ['202', 'Double', 120000, 2, 'available', 'Modern double room', 'WiFi,TV,AC,Minibar'],
      ['301', 'Suite', 250000, 4, 'available', 'Luxury suite with ocean view', 'WiFi,TV,AC,Balcony,Minibar,Jacuzzi'],
      ['302', 'Suite', 250000, 4, 'available', 'Presidential suite', 'WiFi,TV,AC,Balcony,Minibar,Jacuzzi,Kitchen'],
      ['103', 'Single', 80000, 1, 'available', 'Budget-friendly single room', 'WiFi,TV'],
      ['203', 'Double', 120000, 2, 'available', 'Family-friendly double room', 'WiFi,TV,AC'],
      ['204', 'Double', 120000, 2, 'occupied', 'Deluxe double room', 'WiFi,TV,AC,Minibar'],
      ['303', 'Suite', 250000, 4, 'maintenance', 'Royal suite under renovation', 'WiFi,TV,AC,Balcony,Minibar']
    ];

    rooms.forEach(room => insertRoom.run(...room));
    console.log('Database seeded with sample rooms');
  }
}

export default db;
