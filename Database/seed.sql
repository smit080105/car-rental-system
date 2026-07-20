USE car_rental;

-- Insert Demo Users (passwords are hashed with bcryptjs)
INSERT INTO users (name, email, password, phone) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '$2a$10$oDfv8fCHoYAVMJ7KqVJ9fe1rKDv0tqVNvOUbvKsXFKKbZj/i5n5pC', '9876543210'),
('Priya Iyer', 'priya.iyer@example.com', '$2a$10$7qF4s3zKH9GQmVqN8sJ2/OhE7hE7kL8pM2wK5v6Y9zQ4sB3cX5d8a', '9876543211');

-- Insert Demo Cars (20 cars for variety)
INSERT INTO cars (name, brand, type, pricePerDay, available) VALUES
('Swift', 'Maruti', 'Hatchback', 2500, TRUE),
('Creta', 'Hyundai', 'SUV', 3500, TRUE),
('City', 'Honda', 'Sedan', 3000, TRUE),
('Fortuner', 'Toyota', 'SUV', 4500, TRUE),
('Nexon EV', 'Tata', 'Electric SUV', 3200, TRUE),
('Thar', 'Mahindra', 'SUV', 3800, TRUE),
('Seltos', 'Kia', 'Compact SUV', 3300, TRUE),
('3 Series', 'BMW', 'Sedan', 5500, TRUE),
('Polo', 'Volkswagen', 'Hatchback', 2800, TRUE),
('Mustang', 'Ford', 'Sports', 6000, TRUE),
('Innova', 'Toyota', 'MPV', 3700, TRUE),
('XUV300', 'Mahindra', 'Compact SUV', 3100, TRUE),
('Kia Sonet', 'Kia', 'Compact SUV', 3000, TRUE),
('MG Hector', 'MG', 'Mid-size SUV', 3600, TRUE),
('Jeep Compass', 'Jeep', 'Compact SUV', 3900, TRUE),
('Skoda Rapid', 'Skoda', 'Sedan', 2900, TRUE),
('Verna', 'Hyundai', 'Compact Sedan', 2700, TRUE),
('Alturas G4', 'Isuzu', 'Full-size SUV', 4200, TRUE),
('XUV700', 'Mahindra', 'Premium SUV', 4800, TRUE),
('Ciaz', 'Maruti', 'Sedan', 2600, TRUE);
