import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

export default function EditProfile({ onClose }) {
  const { user, profile, updateProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', username: '', status: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name || '',
        username: profile.username || '',
        status: profile.status || '',
      });
      setPreview(profile.avatar_url || '');
    }
  }, [profile]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const save = async () => {
    setLoading(true);
    let avatarUrl = profile?.avatar_url;

    if (avatar) {
      const { data } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}.jpg`, avatar, { upsert: true });
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      avatarUrl = publicUrl;
    }

    await updateProfile({ ...form, avatar_url: avatarUrl });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ fontSize: '24px', color: '#0d9488', textAlign: 'center', marginBottom: '16px' }}>
          Edit Profile
        </h2>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src={preview || 'https://via.placeholder.com/100'}
            alt="avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <label style={{ display: 'block', marginTop: '8px' }}>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            <span className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}>
              Change Photo
            </span>
          </label>
        </div>
        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="input"
        />
        <textarea
          placeholder="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="input"
          style={{ height: '80px', resize: 'none' }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={save} disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}