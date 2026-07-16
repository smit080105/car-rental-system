import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function Fleet() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingCarId, setBookingCarId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/cars`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load cars');
        setLoading(false);
        return;
      }

      setCars(data.cars || data);
    } catch (err) {
      setError('Connection error. Is backend running on port 5000?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (carId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please login to book a car');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setBookingCarId(carId);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carId })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Booking failed');
        setBookingCarId(null);
        return;
      }

      setMessage('Car booked successfully!');
      fetchCars(); // refresh list in case availability changed
    } catch (err) {
      setMessage('Connection error. Is backend running on port 5000?');
      console.error(err);
    } finally {
      setBookingCarId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '18px' }}>Loading fleet...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>🚗 CAR RENTAL</h1>
      <h2 style={{ color: '#ccc', textAlign: 'center', marginBottom: '30px' }}>Available Fleet</h2>

      {error && (
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '20px' }}>{error}</p>
      )}
      {message && (
        <p style={{ color: '#4caf50', textAlign: 'center', marginBottom: '20px' }}>{message}</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {cars.length === 0 && !error && (
          <p style={{ color: '#aaa', gridColumn: '1 / -1', textAlign: 'center' }}>
            No cars available right now.
          </p>
        )}

        {cars.map((car) => (
          <div key={car._id || car.id} style={{
            background: '#2a2a2a',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>{car.name || car.model}</h3>
            <p style={{ color: '#aaa', marginBottom: '5px' }}>Brand: {car.brand}</p>
            <p style={{ color: '#aaa', marginBottom: '5px' }}>Type: {car.type}</p>
            <p style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '15px' }}>
              ₹{car.pricePerDay} / day
            </p>

            <button
              onClick={() => handleBook(car._id || car.id)}
              disabled={bookingCarId === (car._id || car.id) || car.available === false}
              style={{
                width: '100%',
                padding: '10px',
                background: car.available === false ? '#555' : '#ff9800',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: car.available === false ? 'not-allowed' : 'pointer'
              }}
            >
              {car.available === false
                ? 'Unavailable'
                : bookingCarId === (car._id || car.id)
                ? 'Booking...'
                : 'Book Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}