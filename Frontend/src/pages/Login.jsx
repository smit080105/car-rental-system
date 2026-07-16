import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
      navigate('/fleet');
    } else {
      setError('Please fill all fields');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '400px', padding: '40px', background: '#2a2a2a', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>🚗 CAR RENTAL</h1>
        <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>Login</h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
              placeholder="Enter password"
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
            Login
          </button>
        </form>

        <p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
          Don't have account? <a href="/signup" style={{ color: '#ff9800' }}>Sign up</a>
        </p>

        <div style={{ marginTop: '30px', padding: '15px', background: '#3a3a3a', borderRadius: '5px' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>Demo Accounts:</p>
          <p style={{ color: '#ff9800', fontSize: '12px' }}>aarav.sharma@example.com / any password</p>
          <p style={{ color: '#ff9800', fontSize: '12px' }}>priya.iyer@example.com / any password</p>
        </div>
      </div>
    </div>
  );
}