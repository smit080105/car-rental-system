import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login to view bookings');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load bookings');
        setLoading(false);
        return;
      }

      setBookings(data.bookings || data);
    } catch (err) {
      setError('Connection error. Is backend running on port 5000?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    setCancellingId(bookingId);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Cancellation failed');
        setCancellingId(null);
        return;
      }

      setMessage('Booking cancelled successfully!');
      fetchBookings(); // refresh list
    } catch (err) {
      setMessage('Connection error. Is backend running on port 5000?');
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '18px' }}>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>🚗 CAR RENTAL</h1>
      <h2 style={{ color: '#ccc', textAlign: 'center', marginBottom: '30px' }}>My Bookings</h2>

      {error && (
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '20px' }}>{error}</p>
      )}
      {message && (
        <p style={{ color: '#4caf50', textAlign: 'center', marginBottom: '20px' }}>{message}</p>
      )}

      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {bookings.length === 0 && !error && (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>
            No bookings yet. <a href="/fleet" style={{ color: '#ff9800' }}>Browse cars and make a booking!</a>
          </p>
        )}

        {bookings.map((booking) => (
          <div key={booking._id || booking.id} style={{
            background: '#2a2a2a',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>CAR</p>
                <p style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                  {booking.carId?.name || booking.carName || 'Unknown Car'}
                </p>
              </div>
              <div>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>BOOKING ID</p>
                <p style={{ color: '#ff9800', fontSize: '14px', fontFamily: 'monospace' }}>
                  {booking._id?.slice(-8) || booking.id}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>CHECK-IN</p>
                <p style={{ color: '#fff' }}>
                  {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>CHECK-OUT</p>
                <p style={{ color: '#fff' }}>
                  {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>TOTAL COST</p>
                <p style={{ color: '#4caf50', fontWeight: 'bold' }}>
                  ₹{booking.totalCost || '0'}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>STATUS</p>
              <p style={{
                color: booking.status === 'active' ? '#4caf50' : '#ff6b6b',
                fontWeight: 'bold'
              }}>
                {booking.status?.toUpperCase() || 'PENDING'}
              </p>
            </div>

            {booking.status === 'active' && (
              <button
                onClick={() => handleCancel(booking._id || booking.id)}
                disabled={cancellingId === (booking._id || booking.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {cancellingId === (booking._id || booking.id)
                  ? 'Cancelling...'
                  : 'Cancel Booking'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}