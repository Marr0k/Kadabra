import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      router.push(`/cards/${query}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Magic: The Gathering Card Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Enter card name"
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
