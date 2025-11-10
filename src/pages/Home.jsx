import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ color: '#0d9488', fontSize: '28px', marginBottom: '16px' }}>
        Welcome, {user?.name || user?.email}!
      </h1>
      <div style={{ display: 'grid', gap: '16px' }}>
        <Link
          to="/chats"
          style={{
            display: 'block',
            padding: '16px',
            background: 'linear-gradient(to right, #06b6d4, #0d9488)',
            color: 'white',
            textAlign: 'center',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          Go to Chats
        </Link>
        <Link
          to="/stories"
          style={{
            display: 'block',
            padding: '16px',
            background: '#f0f9ff',
            color: '#06b6d4',
            textAlign: 'center',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            border: '2px solid #06b6d4'
          }}
        >
          View Stories
        </Link>
        <Link
          to="/profile"
          style={{
            display: 'block',
            padding: '16px',
            background: '#f0f9ff',
            color: '#06b6d4',
            textAlign: 'center',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            border: '2px solid #06b6d4'
          }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}