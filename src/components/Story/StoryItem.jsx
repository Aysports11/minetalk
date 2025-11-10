import { HeartIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function StoryItem({ story, onLike, isLiked }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full mr-2" />
        <div>
          <p className="font-bold text-sm">{story.profiles?.username || 'User'}</p>
          <p className="text-xs text-gray-500">{dayjs(story.created_at).fromNow()}</p>
        </div>
      </div>

      {/* Image */}
      {story.image_url && (
        <img
          src={story.image_url}
          alt="story"
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      )}

      {/* Caption */}
      <p className="mb-2">{story.caption}</p>

      {/* Like Button */}
      <button
        onClick={() => onLike(story.id)}
        disabled={isLiked}
        className={`flex items-center space-x-1 text-sm ${
          isLiked ? 'text-red-500' : 'text-gray-600'
        }`}
      >
        <HeartIcon className="h-5 w-5" />
        <span>{story.story_likes?.length || 0}</span>
      </button>
    </div>
  );
}