import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ fullName: '', status: '', avatar: null });
  const [showEdit, setShowEdit] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || user.email,
        status: user.status || 'Hey there!',
        avatar: user.avatar
      });
    }
  }, [user]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('status', profile.status);

      if (preview) {
        formData.append('avatar', preview); // Upload file
      }

      await pb.collection('users').update(user.id, formData);
      setShowEdit(false);
      alert('Profile saved!');
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#06b6d4' }}>
        Back to Home
      </Link>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <img
          src={preview || profile.avatar || 'https://via.placeholder.com/100?text=U'}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }}
        />
        <h2 style={{ color: '#0d9488', fontSize: '24px', marginBottom: '8px' }}>{profile.fullName}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{profile.status}</p>
        <button onClick={() => setShowEdit(true)} style={{ padding: '12px 24px', background: 'linear-gradient(to right, #06b6d4, #0d9488)', color: 'white', border: 'none', borderRadius: '12px', marginRight: '10px' }}>
          Edit
        </button>
        <button onClick={logout} style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px' }}>
          Logout
        </button>
      </div>

      {showEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%' }}>
            <h3 style={{ color: '#0d9488', marginBottom: '16px' }}>Edit Profile</h3>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginBottom: '16px' }} />
            {preview && <img src={preview} alt="Preview" style={{ width: '100px', borderRadius: '50%', marginBottom: '16px' }} />}
            <input
              type="text"
              placeholder="Full Name"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <textarea
              placeholder="Status"
              value={profile.status}
              onChange={(e) => setProfile({ ...profile, status: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', height: '80px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveProfile} style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px' }}>
                Save
              </button>
              <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: '12px', background: '#ddd', border: 'none', borderRadius: '12px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}