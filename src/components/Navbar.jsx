import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #ddd',
      padding: '12px 0',
      display: 'flex',
      justifyContent: 'space-around',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <Link to="/" style={{ color: isActive('/') ? '#06b6d4' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/chats" style={{ color: isActive('/chats') ? '#06b6d4' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        Chat
      </Link>
      <Link to="/stories" style={{ color: isActive('/stories') ? '#06b6d4' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        Camera
      </Link>
      <Link to="/profile" style={{ color: isActive('/profile') ? '#06b6d4' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        Profile
      </Link>
    </div>
  );
}