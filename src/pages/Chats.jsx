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
    const load = async () => {
      try {
        const records = await pb.collection('messages').getFullList({
          filter: `sender = "${user.id}" || receiver = "${user.id}"`,
          sort: 'created'
        });
        const expanded = await Promise.all(
          records.map(m => pb.collection('messages').getOne(m.id, { expand: 'sender,receiver' }))
        );
        setMessages(expanded);
      } catch (err) {
        console.log('No messages yet');
      }
    };
    load();

    const unsub = pb.collection('messages').subscribe('*', async (e) => {
      if (e.action === 'create') {
        const msg = await pb.collection('messages').getOne(e.record.id, { expand: 'sender,receiver' });
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => unsub();
  }, [user.id]);

  const send = async () => {
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
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <Link to="/" style={{ color: '#06b6d4' }}>Back</Link>
      <h1 style={{ color: '#0d9488' }}>Chat</h1>
      <input
        placeholder="Receiver username"
        value={receiverUsername}
        onChange={e => setReceiverUsername(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
      />
      <div style={{ height: '400px', overflowY: 'auto', background: '#f9f9f9', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
        {messages.map(m => (
          <div key={m.id} style={{ textAlign: m.sender === user.id ? 'right' : 'left', margin: '8px 0' }}>
            <div style={{
              display: 'inline-block',
              background: m.sender === user.id ? '#06b6d4' : '#e5e7eb',
              color: m.sender === user.id ? 'white' : 'black',
              padding: '10px 14px',
              borderRadius: '18px',
              maxWidth: '70%'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{m.expand?.sender?.username}</p>
              <p style={{ margin: 0 }}>{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          placeholder="Type message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && send()}
          style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
        />
        <button onClick={send} style={{
          padding: '12px 16px',
          background: '#0d9488',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}>Send</button>
      </div>
    </div>
  );
}