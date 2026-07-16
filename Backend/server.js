require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============ IN-MEMORY DATABASE (for now) ============
// In real app, this would be PostgreSQL
let users = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', password: bcrypt.hashSync('password1', 10), phone: '+91-9820011122' },
  { id: 2, name: 'Priya Iyer', email: 'priya.iyer@example.com', password: bcrypt.hashSync('password2', 10), phone: '+91-9820011123' },
  { id: 3, name: 'Rohan Mehta', email: 'rohan.mehta@example.com', password: bcrypt.hashSync('password3', 10), phone: '+91-9820011124' },
  { id: 4, name: 'Sneha Kulkarni', email: 'sneha.kulkarni@example.com', password: bcrypt.hashSync('password4', 10), phone: '+91-9820011125' },
  { id: 5, name: 'Vikram Desai', email: 'vikram.desai@example.com', password: bcrypt.hashSync('password5', 10), phone: '+91-9820011126' },
  { id: 6, name: 'Anjali Nair', email: 'anjali.nair@example.com', password: bcrypt.hashSync('password6', 10), phone: '+91-9820011127' },
  { id: 7, name: 'Karan Patel', email: 'karan.patel@example.com', password: bcrypt.hashSync('password7', 10), phone: '+91-9820011128' },
  { id: 8, name: 'Divya Reddy', email: 'divya.reddy@example.com', password: bcrypt.hashSync('password8', 10), phone: '+91-9820011129' },
  { id: 9, name: 'Arjun Singh', email: 'arjun.singh@example.com', password: bcrypt.hashSync('password9', 10), phone: '+91-9820011130' },
  { id: 10, name: 'Meera Joshi', email: 'meera.joshi@example.com', password: bcrypt.hashSync('password10', 10), phone: '+91-9820011131' },
];

let cars = [
  { id: 1, brand: 'Maruti', model: 'Swift', year: 2023, price: 1800 },
  { id: 2, brand: 'Hyundai', model: 'Creta', year: 2023, price: 3200 },
  { id: 3, brand: 'Honda', model: 'City', year: 2022, price: 2500 },
  { id: 4, brand: 'Toyota', model: 'Fortuner', year: 2023, price: 5500 },
  { id: 5, brand: 'Tata', model: 'Nexon EV', year: 2023, price: 2800 },
  { id: 6, brand: 'Mahindra', model: 'Thar', year: 2023, price: 3800 },
  { id: 7, brand: 'Kia', model: 'Seltos', year: 2022, price: 3000 },
  { id: 8, brand: 'BMW', model: '3 Series', year: 2023, price: 8500 },
  { id: 9, brand: 'Volkswagen', model: 'Polo', year: 2021, price: 1900 },
  { id: 10, brand: 'Ford', model: 'Mustang', year: 2022, price: 9500 },
];

let bookings = [];
let nextBookingId = 1;

const JWT_SECRET = 'your_jwt_secret_key';

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ AUTH ROUTES ============

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
  });
});

// Sign up
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    phone
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
  });
});

// ============ CARS ROUTES ============

// Get all cars with booking status
app.get('/api/cars', (req, res) => {
  const carsWithStatus = cars.map(car => {
    const activeBooking = bookings.find(b => b.carId === car.id && b.status === 'active');
    return {
      ...car,
      available: !activeBooking,
      bookedBy: activeBooking ? activeBooking.userId : null
    };
  });
  res.json({ cars: carsWithStatus });
});

// Get single car
app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).json({ error: 'Car not found' });

  const activeBooking = bookings.find(b => b.carId === car.id && b.status === 'active');
  
  res.json({
    car: {
      ...car,
      available: !activeBooking,
      bookedBy: activeBooking ? activeBooking.userId : null
    }
  });
});

// ============ BOOKINGS ROUTES ============

// Book a car
app.post('/api/bookings', (req, res) => {
  const { userId, carId, days } = req.body;

  if (!userId || !carId || !days) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if car is already booked
  const activeBooking = bookings.find(b => b.carId === carId && b.status === 'active');
  if (activeBooking) {
    return res.status(409).json({ error: 'This car is already booked by another user' });
  }

  const car = cars.find(c => c.id === carId);
  const totalPrice = car.price * days;

  const booking = {
    id: nextBookingId++,
    userId,
    carId,
    days,
    totalPrice,
    status: 'active',
    createdAt: new Date()
  };

  bookings.push(booking);
  res.status(201).json({ booking });
});

// Get user's bookings
app.get('/api/bookings/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userBookings = bookings.filter(b => b.userId === userId);

  const bookingsWithCars = userBookings.map(booking => {
    const car = cars.find(c => c.id === booking.carId);
    return { ...booking, car };
  });

  res.json({ bookings: bookingsWithCars });
});

// Return a car
app.put('/api/bookings/:id/return', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'completed';
  booking.returnedAt = new Date();

  res.json({ booking, message: 'Car returned successfully' });
});

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Car Rental Backend running on http://localhost:${PORT}`);
});