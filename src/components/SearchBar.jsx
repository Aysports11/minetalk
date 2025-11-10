import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!query.trim()) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`);
    setResults(data);
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && search()}
          placeholder="Search username or email..."
          className="input"
          style={{ flex: 1 }}
        />
        <button onClick={search} className="btn btn-primary" style={{ width: 'auto', padding: '0 20px' }}>
          Go
        </button>
      </div>
      <div style={{ marginTop: '12px' }}>
        {results.map(u => (
          <div
            key={u.id}
            onClick={() => { onSelect(u); setResults([]); setQuery(''); }}
            className="card"
            style={{ cursor: 'pointer', padding: '12px' }}
          >
            <p style={{ fontWeight: 'bold' }}>{u.full_name || u.username}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>@{u.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}