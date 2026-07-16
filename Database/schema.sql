-- Car Rental System Database Schema
-- 10 Users + 10 Cars + Booking System

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table (10 users with real emails)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cars Table (10 car models - NO IMAGES)
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    category VARCHAR(30) NOT NULL,
    price_per_day NUMERIC(10, 2) NOT NULL,
    seats INT NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table (The locking logic - one car, one user at a time)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, cancelled
    pickup_location VARCHAR(150),
    returned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

-- Unique index: Only ONE active booking per car (THE LOCK)
CREATE UNIQUE INDEX idx_one_booking_per_car 
ON bookings(car_id) WHERE status = 'active';

-- Other useful indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_car ON bookings(car_id);