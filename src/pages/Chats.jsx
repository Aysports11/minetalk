import { useEffect, useState } from 'react';
import { pb } from '../services/pocketbase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Chats() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const records = await pb.collection('messages').getFullList({
          sort: 'created',
          filter: `(sender = "${user.id}") || (receiver = "${user.id}")`
        });
        setMessages(records); // No expand for simplicity — add later if needed
      } catch (err) {
        console.error('Load error:', err);
        alert('Error loading messages: ' + err.message);
      }
    };

    loadMessages();

    const unsubscribe = pb.collection('messages').subscribe('*', (e) => {
      if (e.action === 'create') {
        setMessages(prev => [...prev, e.record]);
      }
    });

    return () => unsubscribe();
  }, [user.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiverUsername.trim()) return;

    try {
      const receiver = await pb.collection('users').getFirstListItem(`username = "${receiverUsername}"`);

      await pb.collection('messages').create({
        sender: user.id,
        receiver: receiver.id,
        content: newMessage
      });

      setNewMessage('');
    } catch (err) {
      console.error('Send error:', err);
      alert('Error sending message: ' + err.message + '. Check username or permissions.');
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#06b6d4' }}>
        Back to Home
      </Link>

      <h1 style={{ color: '#0d9488', fontSize: '28px', marginBottom: '16px' }}>Chat</h1>

      <input
        type="text"
        placeholder="Receiver username (e.g., bob456)"
        value={receiverUsername}
        onChange={(e) => setReceiverUsername(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
      />

      <div style={{ height: '400px', overflowY: 'auto', background: '#f9f9f9', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
        {messages.map(m => (
          <div
            key={m.id}
            style={{
              textAlign: m.sender === user.id ? 'right' : 'left',
              margin: '8px 0'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: m.sender === user.id ? '#06b6d4' : '#e5e7eb',
                color: m.sender === user.id ? 'white' : 'black',
                padding: '10px 14px',
                borderRadius: '18px',
                maxWidth: '70%'
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>{m.content}</p>
              <small style={{ opacity: 0.7 }}>{new Date(m.created).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '12px 16px',
            background: 'linear-gradient(to right, #06b6d4, #0d9488)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}