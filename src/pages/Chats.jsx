import { useEffect, useState } from 'react';
import { pb } from '../services/pocketbase';
import { useAuth } from '../context/AuthContext';

export default function Chats() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages
    pb.collection('messages').subscribe('*', (e) => {
      setMessages(prev => [...prev, e.record]);
    });
  }, []);

  const sendMessage = async (content, receiverId) => {
    await pb.collection('messages').create({
      senderId: user.id,
      receiverId,
      content
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Chat UI */}
      {messages.map(m => <p key={m.id}>{m.content}</p>)}
      <input type="text" onKeyPress={(e) => e.key === 'Enter' && sendMessage(e.target.value, 'otherUserId')} />
    </div>
  );
}