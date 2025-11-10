import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import StoryItem from './StoryItem';

export default function StoryFeed() {
  const [stories, setStories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from('stories')
        .select('*, profiles(username, avatar_url), story_likes(user_id)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      setStories(data || []);
    };
    fetchStories();

    const subscription = supabase
      .channel('stories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, fetchStories)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const likeStory = async (storyId) => {
    await supabase.from('story_likes').insert({ story_id: storyId, user_id: user.id });
  };

  return (
    <div className="p-4 space-y-4">
      {stories.map(story => {
        const isLiked = story.story_likes?.some(like => like.user_id === user.id);
        return (
          <StoryItem
            key={story.id}
            story={story}
            onLike={likeStory}
            isLiked={isLiked}
          />
        );
      })}
    </div>
  );
}