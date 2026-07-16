-- Insert 10 Users
INSERT INTO users (name, email, password, phone) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', 'hashed_password_1', '+91-9820011122'),
('Priya Iyer', 'priya.iyer@example.com', 'hashed_password_2', '+91-9820011123'),
('Rohan Mehta', 'rohan.mehta@example.com', 'hashed_password_3', '+91-9820011124'),
('Sneha Kulkarni', 'sneha.kulkarni@example.com', 'hashed_password_4', '+91-9820011125'),
('Vikram Desai', 'vikram.desai@example.com', 'hashed_password_5', '+91-9820011126'),
('Anjali Nair', 'anjali.nair@example.com', 'hashed_password_6', '+91-9820011127'),
('Karan Patel', 'karan.patel@example.com', 'hashed_password_7', '+91-9820011128'),
('Divya Reddy', 'divya.reddy@example.com', 'hashed_password_8', '+91-9820011129'),
('Arjun Singh', 'arjun.singh@example.com', 'hashed_password_9', '+91-9820011130'),
('Meera Joshi', 'meera.joshi@example.com', 'hashed_password_10', '+91-9820011131');

-- Insert 10 Cars (NO IMAGES - Simple UI)
INSERT INTO cars (brand, model, year, category, price_per_day, seats, fuel_type, transmission, location) VALUES
('Maruti', 'Swift', 2023, 'Hatchback', 1800, 5, 'Petrol', 'Manual', 'Pune'),
('Hyundai', 'Creta', 2023, 'SUV', 3200, 5, 'Diesel', 'Automatic', 'Pune'),
('Honda', 'City', 2022, 'Sedan', 2500, 5, 'Petrol', 'Automatic', 'Mumbai'),
('Toyota', 'Fortuner', 2023, 'SUV', 5500, 7, 'Diesel', 'Automatic', 'Mumbai'),
('Tata', 'Nexon EV', 2023, 'Electric', 2800, 5, 'Electric', 'Automatic', 'Pune'),
('Mahindra', 'Thar', 2023, 'SUV', 3800, 4, 'Diesel', 'Manual', 'Nashik'),
('Kia', 'Seltos', 2022, 'SUV', 3000, 5, 'Petrol', 'Automatic', 'Mumbai'),
('BMW', '3 Series', 2023, 'Luxury', 8500, 5, 'Petrol', 'Automatic', 'Mumbai'),
('Volkswagen', 'Polo', 2021, 'Hatchback', 1900, 5, 'Petrol', 'Manual', 'Pune'),
('Ford', 'Mustang', 2022, 'Sports', 9500, 4, 'Petrol', 'Automatic', 'Mumbai');