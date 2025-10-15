import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { initializeDatabase, seedDatabase } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();
seedDatabase();

// ============ ROOM ROUTES ============
// Get all rooms
app.get('/api/rooms', (req, res) => {
  try {
    const { status, type } = req.query;
    let query = 'SELECT * FROM rooms';
    const params = [];

    if (status || type) {
      query += ' WHERE';
      if (status) {
        query += ' status = ?';
        params.push(status);
      }
      if (type) {
        query += status ? ' AND room_type = ?' : ' room_type = ?';
        params.push(type);
      }
    }

    const rooms = db.prepare(query).all(...params);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single room
app.get('/api/rooms/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room
app.post('/api/rooms', (req, res) => {
  try {
    const { room_number, room_type, price_per_night, capacity, description, amenities } = req.body;
    const result = db.prepare(`
      INSERT INTO rooms (room_number, room_type, price_per_night, capacity, description, amenities)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(room_number, room_type, price_per_night, capacity, description, amenities);
    
    const newRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room
app.put('/api/rooms/:id', (req, res) => {
  try {
    const { room_number, room_type, price_per_night, capacity, status, description, amenities } = req.body;
    db.prepare(`
      UPDATE rooms 
      SET room_number = ?, room_type = ?, price_per_night = ?, capacity = ?, 
          status = ?, description = ?, amenities = ?
      WHERE id = ?
    `).run(room_number, room_type, price_per_night, capacity, status, description, amenities, req.params.id);
    
    const updatedRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete room
app.delete('/api/rooms/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM rooms WHERE id = ?').run(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ GUEST ROUTES ============
// Get all guests
app.get('/api/guests', (req, res) => {
  try {
    const guests = db.prepare('SELECT * FROM guests ORDER BY created_at DESC').all();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single guest
app.get('/api/guests/:id', (req, res) => {
  try {
    const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create guest
app.post('/api/guests', (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, id_number } = req.body;
    const result = db.prepare(`
      INSERT INTO guests (first_name, last_name, email, phone, address, id_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, email, phone, address, id_number);
    
    const newGuest = db.prepare('SELECT * FROM guests WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update guest
app.put('/api/guests/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, id_number } = req.body;
    db.prepare(`
      UPDATE guests 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, id_number = ?
      WHERE id = ?
    `).run(first_name, last_name, email, phone, address, id_number, req.params.id);
    
    const updatedGuest = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.id);
    res.json(updatedGuest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete guest
app.delete('/api/guests/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BOOKING ROUTES ============
// Get all bookings with guest and room details
app.get('/api/bookings', (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        g.phone as guest_phone,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
    `;
    
    if (status) {
      query += ' WHERE b.status = ?';
      const bookings = db.prepare(query).all(status);
      return res.json(bookings);
    }
    
    const bookings = db.prepare(query + ' ORDER BY b.created_at DESC').all();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single booking
app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests } = req.body;
    
    // Check if room is available
    const room = db.prepare('SELECT status FROM rooms WHERE id = ?').get(room_id);
    if (!room || room.status !== 'available') {
      return res.status(400).json({ error: 'Room is not available' });
    }
    
    const result = db.prepare(`
      INSERT INTO bookings (guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(guest_id, room_id, check_in_date, check_out_date, total_amount, special_requests || '');
    
    // Update room status to occupied
    db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('occupied', room_id);
    
    const newBooking = db.prepare(`
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
  try {
    const { status, check_in_date, check_out_date, total_amount, special_requests } = req.body;
    
    db.prepare(`
      UPDATE bookings 
      SET status = ?, check_in_date = ?, check_out_date = ?, total_amount = ?, special_requests = ?
      WHERE id = ?
    `).run(status, check_in_date, check_out_date, total_amount, special_requests, req.params.id);
    
    // If booking is cancelled or completed, update room status
    if (status === 'cancelled' || status === 'completed') {
      const booking = db.prepare('SELECT room_id FROM bookings WHERE id = ?').get(req.params.id);
      db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('available', booking.room_id);
    }
    
    const updatedBooking = db.prepare(`
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(req.params.id);
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-out
app.post('/api/bookings/:id/checkout', (req, res) => {
  try {
    const booking = db.prepare('SELECT room_id FROM bookings WHERE id = ?').get(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update booking status
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('completed', req.params.id);
    
    // Update room status to available
    db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('available', booking.room_id);
    
    res.json({ message: 'Check-out successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const booking = db.prepare('SELECT room_id FROM bookings WHERE id = ?').get(req.params.id);
    
    if (booking) {
      db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('available', booking.room_id);
    }
    
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DASHBOARD STATS ============
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = {
      totalRooms: db.prepare('SELECT COUNT(*) as count FROM rooms').get().count,
      availableRooms: db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'available'").get().count,
      occupiedRooms: db.prepare("SELECT COUNT(*) as count FROM rooms WHERE status = 'occupied'").get().count,
      totalGuests: db.prepare('SELECT COUNT(*) as count FROM guests').get().count,
      activeBookings: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get().count,
      completedBookings: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'").get().count,
      totalRevenue: db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status IN ('confirmed', 'completed')").get().total,
      todayCheckIns: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE date(check_in_date) = date('now')").get().count,
      todayCheckOuts: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE date(check_out_date) = date('now')").get().count
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recent bookings for dashboard
app.get('/api/dashboard/recent-bookings', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `).all();
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hotel Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
