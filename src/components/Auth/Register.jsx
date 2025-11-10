import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', username: '', fullName: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form.email, form.password, form.username, form.fullName);
    alert('Registered! You can now log in.');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#0d9488', marginBottom: '20px', fontSize: '28px' }}>
          Join MineTalk
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '14px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '16px' }}
            required
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(to right, #06b6d4, #0d9488)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Have an account? <Link to="/login" style={{ color: '#06b6d4', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}