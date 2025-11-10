import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Stories() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const stories = [
    { id: 1, user: 'Alice', time: '2h ago', image: true, caption: 'Loving this sunset!' },
    { id: 2, user: 'Bob', time: '5h ago', image: false, caption: 'Weekend vibes' },
    { id: 3, user: 'You', time: 'Now', image: true, caption: 'My first story!' },
  ];

  const handleTakePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
      alert('Photo captured! Ready to upload.');
      // TODO: Upload to PocketBase later
    };
    reader.readAsDataURL(file);
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#0d9488', fontSize: '28px' }}>Stories</h1>

        {/* CAMERA BUTTON */}
        <label htmlFor="camera-input" style={{ cursor: 'pointer' }}>
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"  // ← CRITICAL: Opens BACK CAMERA on Android
            onChange={handleTakePhoto}
            style={{ display: 'none' }}
          />
          <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(to right, #06b6d4, #0d9488)',
            color: 'white',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            Take Photo
          </div>
        </label>
      </div>

      {/* PHOTO PREVIEW */}
      {photoPreview && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <img
            src={photoPreview}
            alt="Your story"
            style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          />
          <p style={{ color: '#0d9488', marginTop: '8px' }}>Your photo is ready!</p>
        </div>
      )}

      {/* STORIES FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {stories.map(s => (
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
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: s.image ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' : '#ccc',
              border: s.image ? '3px solid #f09433' : 'none'
            }} />
            <div>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{s.user}</p>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{s.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* STORY VIEWER */}
      {selectedStory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', color: 'white', maxWidth: '90%' }}>
            <h2 style={{ marginBottom: '16px' }}>{selectedStory.user}'s Story</h2>
            {selectedStory.image && (
              <img
                src={`https://via.placeholder.com/300x500?text=${encodeURIComponent(selectedStory.caption)}`}
                alt="Story"
                style={{ width: '100%', maxWidth: '350px', borderRadius: '16px', marginBottom: '16px' }}
              />
            )}
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>{selectedStory.caption}</p>
            <button
              onClick={() => setSelectedStory(null)}
              style={{ padding: '12px 24px', background: 'white', color: '#0d9488', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}