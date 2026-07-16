import { useState } from 'react';

const CARS = [
  { id: 1, brand: 'Maruti', model: 'Swift', price: 1800, year: 2023 },
  { id: 2, brand: 'Hyundai', model: 'Creta', price: 3200, year: 2023 },
  { id: 3, brand: 'Honda', model: 'City', price: 2500, year: 2022 },
  { id: 4, brand: 'Toyota', model: 'Fortuner', price: 5500, year: 2023 },
  { id: 5, brand: 'Tata', model: 'Nexon EV', price: 2800, year: 2023 },
  { id: 6, brand: 'Mahindra', model: 'Thar', price: 3800, year: 2023 },
  { id: 7, brand: 'Kia', model: 'Seltos', price: 3000, year: 2022 },
  { id: 8, brand: 'BMW', model: '3 Series', price: 8500, year: 2023 },
  { id: 9, brand: 'Volkswagen', model: 'Polo', price: 1900, year: 2021 },
  { id: 10, brand: 'Ford', model: 'Mustang', price: 9500, year: 2022 },
];

export default function Fleet() {
  const [bookedCars, setBookedCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleBookCar = (carId) => {
    if (!bookedCars.includes(carId)) {
      setBookedCars([...bookedCars, carId]);
      setSelectedCar(null);
      alert('Car booked successfully for ' + user.name);
    }
  };

  const handleReturnCar = (carId) => {
    setBookedCars(bookedCars.filter(id => id !== carId));
    alert('Car returned successfully');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '32px' }}>🚗 Available Cars</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            style={{
              padding: '10px 20px',
              background: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>

        <p style={{ color: '#aaa', marginBottom: '30px' }}>Welcome, {user.name}! Choose a car to book.</p>

        {/* Cars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {CARS.map(car => {
            const isBooked = bookedCars.includes(car.id);
            return (
              <div
                key={car.id}
                style={{
                  background: '#2a2a2a',
                  border: isBooked ? '2px solid #ff6b6b' : '1px solid #555',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  opacity: isBooked ? 0.6 : 1,
                  transition: 'all 0.3s'
                }}
              >
                {/* Car Placeholder (No Image) */}
                <div style={{
                  background: '#3a3a3a',
                  height: '150px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px'
                }}>
                  <p style={{ color: '#888', fontSize: '14px' }}>{car.brand} {car.model}</p>
                </div>

                {/* Car Info */}
                <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '10px' }}>
                  {car.brand} {car.model}
                </h3>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>Year: {car.year}</p>
                <p style={{ color: '#ff9800', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                  ₹{car.price}/day
                </p>

                {/* Status */}
                <p style={{ color: isBooked ? '#ff6b6b' : '#35c98f', fontSize: '12px', marginBottom: '15px', fontWeight: 'bold' }}>
                  {isBooked ? '❌ BOOKED' : '✅ AVAILABLE'}
                </p>

                {/* Action Button */}
                <button
                  onClick={() => {
                    if (isBooked) {
                      handleReturnCar(car.id);
                    } else {
                      setSelectedCar(car);
                    }
                  }}
                  disabled={isBooked ? false : false}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isBooked ? '#ff6b6b' : '#ff9800',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isBooked ? 'Return Car' : 'Book Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Booking Modal */}
        {selectedCar && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#2a2a2a',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h2 style={{ color: '#fff', marginBottom: '20px' }}>Book {selectedCar.brand} {selectedCar.model}</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Days</label>
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  id="days"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                />
              </div>

              <p style={{ color: '#ff9800', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
                Total: ₹{selectedCar.price * (document.getElementById('days')?.value || 1)}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    handleBookCar(selectedCar.id);
                    setSelectedCar(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#35c98f',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setSelectedCar(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#555',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}