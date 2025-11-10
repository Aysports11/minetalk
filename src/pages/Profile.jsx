import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.name || user?.email || 'Your Name',
    status: 'Hey there! I am using MineTalk.',
  });
  const [preview, setPreview] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: '#f0f9ff',
          color: '#06b6d4',
          borderRadius: '12px',
          fontSize: '14px',
          textDecoration: 'none',
          marginBottom: '20px'
        }}
      >
        Back to Home
      </Link>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <img
          src={preview || 'https://via.placeholder.com/100?text=U'}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '0 auto 16px',
            border: '3px solid #06b6d4'
          }}
        />
        <h2 style={{ color: '#0d9488', fontSize: '24px', marginBottom: '8px' }}>
          {editForm.fullName}
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {editForm.status}
        </p>
        <button
          onClick={() => setShowEdit(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(to right, #06b6d4, #0d9488)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Edit Profile
        </button>
        <button
          onClick={logout}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      {showEdit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ color: '#0d9488', marginBottom: '16px' }}>Edit Profile</h3>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ marginBottom: '16px', width: '100%' }} />
            {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px' }} />}
            <input
              type="text"
              placeholder="Full Name"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <textarea
              placeholder="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', height: '80px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowEdit(false)}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(to right, #06b6d4, #0d9488)', color: 'white', border: 'none', borderRadius: '12px' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowEdit(false)}
                style={{ flex: 1, padding: '12px', background: '#ddd', border: 'none', borderRadius: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}