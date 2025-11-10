import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#0d9488', marginBottom: '20px', fontSize: '28px' }}>
          MineTalk Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(to right, #06b6d4, #0d9488)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}
          >
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          No account? <Link to="/register" style={{ color: '#06b6d4', fontWeight: 'bold' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}