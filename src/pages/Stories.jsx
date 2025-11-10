import { useEffect, useState } from 'react';
import { pb } from '../services/pocketbase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Stories() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const records = await pb.collection('stories').getFullList({
          sort: '-created',
          expand: 'user'
        });
        setStories(records);
      } catch (err) {
        console.error('Load stories error:', err);
      }
    };
    load();

    const unsub = pb.collection('stories').subscribe('*', async (e) => {
      if (e.action === 'create') {
        const expanded = await pb.collection('stories').getOne(e.record.id, { expand: 'user' });
        setStories(prev => [expanded, ...prev]);
      }
    });

    return () => unsub();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadStory = async () => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append('user', user.id);
    formData.append('image', photoFile);
    formData.append('caption', caption);

    try {
      await pb.collection('stories').create(formData);
      setPhotoFile(null);
      setPreview(null);
      setCaption('');
      alert('Story uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message + '. Check permissions.');
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#06b6d4' }}>
        Back to Home
      </Link>

      <h1 style={{ color: '#0d9488', fontSize: '28px', marginBottom: '16px' }}>Stories</h1>

      {/* Upload */}
      <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <label style={{ cursor: 'pointer', display: 'block', marginBottom: '12px' }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
          <div style={{
            padding: '12px',
            background: 'linear-gradient(to right, #06b6d4, #0d9488)',
            color: 'white',
            borderRadius: '50px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            📷 Take Photo
          </div>
        </label>

        {preview && (
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px' }} />
          </div>
        )}

        <input
          type="text"
          placeholder="Add caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
        />

        <button
          onClick={uploadStory}
          style={{
            width: '100%',
            padding: '12px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Post Story
        </button>
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {stories.map(s => {
          const imageUrl = s.image ? `${pb.baseUrl}/api/files/stories/${s.id}/${s.image}` : null;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedStory(s)}
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Story"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {s.expand?.user?.username || 'You'}
                </p>
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                  {new Date(s.created).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Viewer */}
      {selectedStory && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{ textAlign: 'center', color: 'white', maxWidth: '90%' }}>
            {selectedStory.image && (
              <img
                src={`${pb.baseUrl}/api/files/stories/${selectedStory.id}/${selectedStory.image}`}
                alt="Story"
                style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', marginBottom: '16px' }}
              />
            )}
            <p style={{ fontSize: '18px' }}>{selectedStory.caption}</p>
            <button
              onClick={() => setSelectedStory(null)}
              style={{ padding: '12px 24px', background: 'white', color: '#0d9488', border: 'none', borderRadius: '12px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}