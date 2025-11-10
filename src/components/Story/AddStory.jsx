import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AddStory({ onClose }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async () => {
    let imageUrl = null;
    if (image) {
      const { data } = await supabase.storage.from('stories').upload(`public/${Date.now()}.jpg`, image);
      imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/stories/${data.path}`;
    }

    await supabase.from('stories').insert({
      user_id: user.id,
      caption,
      image_url: imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-11/12 max-w-md">
        <h3 className="text-xl font-bold mb-4">Add Story</h3>
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-lg mb-3"
          rows="3"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-3"
        />
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold"
          >
            Post
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded-lg font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}