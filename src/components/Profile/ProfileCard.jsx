import { useAuth } from '../../context/AuthContext';

export default function ProfileCard() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <div className="flex items-center space-x-3">
        <img
          src={profile.avatar_url || 'https://via.placeholder.com/60'}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="font-bold text-lg">{profile.full_name || profile.username}</p>
          <p className="text-sm text-gray-600">{profile.status}</p>
        </div>
      </div>
    </div>
  );
}