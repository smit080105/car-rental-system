require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'car_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Quick DB connectivity check on boot so failures are obvious in the console
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'car_rental');
    connection.release();
  } catch (err) {
    console.error('❌ Could not connect to MySQL. Check your .env file and that MySQL is running.');
    console.error('   ', err.message);
  }
})();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ ROOT / HEALTH ============

// Friendly root route so hitting localhost:5000 doesn't just show "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ message: '🚗 Car Rental API is running. Try /api/health or /api/cars.' });
});

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// ============ AUTH ENDPOINTS ============

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone || null]
      );

      // Create JWT
      const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET || 'your_secret_key');

      res.status(201).json({
        token,
        user: { id: result.insertId, name, email, phone }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        'SELECT id, name, email, password, phone FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];
      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_secret_key');

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ CAR ENDPOINTS ============

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [cars] = await connection.query('SELECT * FROM cars');
      res.json(cars);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Get single car
app.get('/api/cars/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [cars] = await connection.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);

      if (cars.length === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }

      res.json(cars[0]);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// ============ BOOKING ENDPOINTS ============

// Create booking
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { carId, checkInDate, checkOutDate, totalCost } = req.body;
    const userId = req.userId;

    if (!carId || !checkInDate || !checkOutDate || !totalCost) {
      return res.status(400).json({ error: 'Missing required fields: carId, checkInDate, checkOutDate, totalCost' });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    const connection = await pool.getConnection();

    try {
      // Check if car exists
      const [cars] = await connection.query('SELECT id FROM cars WHERE id = ?', [carId]);
      if (cars.length === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Insert booking
      const [result] = await connection.query(
        'INSERT INTO bookings (userId, carId, checkInDate, checkOutDate, totalCost, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, carId, checkInDate, checkOutDate, totalCost, 'active']
      );

      res.status(201).json({
        id: result.insertId,
        userId,
        carId,
        checkInDate,
        checkOutDate,
        totalCost,
        status: 'active'
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed: ' + err.message });
  }
});

// Get user bookings
app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();

    try {
      const [bookings] = await connection.query(
        `SELECT b.*, c.name as carName, c.brand, c.type, c.pricePerDay
         FROM bookings b
         JOIN cars c ON b.carId = c.id
         WHERE b.userId = ?
         ORDER BY b.id DESC`,
        [userId]
      );

      res.json(bookings);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking
app.get('/api/bookings/:id', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [bookings] = await connection.query(
        `SELECT b.*, c.name as carName, c.brand
         FROM bookings b
         JOIN cars c ON b.carId = c.id
         WHERE b.id = ? AND b.userId = ?`,
        [req.params.id, req.userId]
      );

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(bookings[0]);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
app.delete('/api/bookings/:id', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Verify booking belongs to user
      const [bookings] = await connection.query(
        'SELECT id FROM bookings WHERE id = ? AND userId = ?',
        [req.params.id, req.userId]
      );

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Update status to cancelled
      await connection.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        ['cancelled', req.params.id]
      );

      res.json({ message: 'Booking cancelled successfully' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

// ============ 404 + ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Car Rental Backend running on http://localhost:${PORT}`);
});
