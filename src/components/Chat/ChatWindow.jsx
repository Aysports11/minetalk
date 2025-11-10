import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import MessageBubble from './MessageBubble';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('user');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!otherUserId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .in('sender_id', [user.id, otherUserId])
        .in('receiver_id', [user.id, otherUserId])
        .order('created_at', { ascending: true });
      setMessages(data);
    };
    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (
          (payload.new.sender_id === user.id && payload.new.receiver_id === otherUserId) ||
          (payload.new.sender_id === otherUserId && payload.new.receiver_id === user.id)
        ) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [otherUserId, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isMine={msg.sender_id === user.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-full"
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white p-3 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}