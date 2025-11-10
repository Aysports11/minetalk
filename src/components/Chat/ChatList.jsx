import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, receiver:receiver_id(username), sender:sender_id(username)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      const unique = data.reduce((acc, msg) => {
        const other = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!acc[other]) acc[other] = msg;
        return acc;
      }, {});

      setChats(Object.values(unique));
    };
    fetchChats();
  }, [user]);

  return (
    <div className="space-y-2">
      {chats.map(chat => {
        const otherUser = chat.sender_id === user.id ? chat.receiver : chat.sender;
        return (
          <Link
            key={otherUser.id}
            to={`/chats?user=${otherUser.id}`}
            className="flex items-center p-3 bg-white rounded-xl shadow"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full mr-3" />
            <div className="flex-1">
              <p className="font-bold">{otherUser.username}</p>
              <p className="text-sm text-gray-600 truncate">{chat.content}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}