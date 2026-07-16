export default function Bookings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  const CARS = [
    { id: 1, brand: 'Maruti', model: 'Swift', price: 1800 },
    { id: 2, brand: 'Hyundai', model: 'Creta', price: 3200 },
    { id: 3, brand: 'Honda', model: 'City', price: 2500 },
    { id: 4, brand: 'Toyota', model: 'Fortuner', price: 5500 },
    { id: 5, brand: 'Tata', model: 'Nexon EV', price: 2800 },
    { id: 6, brand: 'Mahindra', model: 'Thar', price: 3800 },
    { id: 7, brand: 'Kia', model: 'Seltos', price: 3000 },
    { id: 8, brand: 'BMW', model: '3 Series', price: 8500 },
    { id: 9, brand: 'Volkswagen', model: 'Polo', price: 1900 },
    { id: 10, brand: 'Ford', model: 'Mustang', price: 9500 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '32px' }}>📋 My Bookings</h1>
          <button
            onClick={() => window.location.href = '/fleet'}
            style={{
              padding: '10px 20px',
              background: '#ff9800',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Fleet
          </button>
        </div>

        <p style={{ color: '#aaa', marginBottom: '30px' }}>{user.name}'s Active Bookings</p>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div style={{
            background: '#2a2a2a',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '20px' }}>No active bookings</p>
            <button
              onClick={() => window.location.href = '/fleet'}
              style={{
                padding: '10px 20px',
                background: '#35c98f',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Book a Car Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {bookings.map((booking, idx) => {
              const car = CARS.find(c => c.id === booking.carId);
              return (
                <div
                  key={idx}
                  style={{
                    background: '#2a2a2a',
                    border: '1px solid #555',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>
                      {car?.brand} {car?.model}
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '5px' }}>
                      📅 {booking.days} day(s)
                    </p>
                    <p style={{ color: '#ff9800', fontSize: '16px', fontWeight: 'bold' }}>
                      Total: ₹{booking.days * (car?.price || 0)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        const updatedBookings = bookings.filter((_, i) => i !== idx);
                        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
                        window.location.reload();
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
                      Return Car
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}