import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    
    if (name && email && password && phone) {
      localStorage.setItem('user', JSON.stringify({ email, name, phone }));
      navigate('/fleet');
    } else {
      setError('Please fill all fields');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '400px', padding: '40px', background: '#2a2a2a', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>🚗 CAR RENTAL</h1>
        <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>Sign Up</h2>

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '10px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              style={{
                width: '100%',
                padding: '10px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone"
              style={{
                width: '100%',
                padding: '10px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              style={{
                width: '100%',
                padding: '10px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#ff9800',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
          Already have account? <a href="/login" style={{ color: '#ff9800' }}>Login</a>
        </p>
      </div>
    </div>
  );
}