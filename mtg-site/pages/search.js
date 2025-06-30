import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data || []);
      setLoading(false);
    };

    fetchResults();
  }, [q]);

  if (!q) return <p>No search term provided.</p>;
  if (loading) return <p>Loading results for "{q}"...</p>;
  if (results.length === 0) return <p>No cards found for "{q}".</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={() => router.push('/')}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          background: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        ← Return to Search
      </button>
      <h1>Search Results for "{q}"</h1>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 200px)', gap: '1rem' }}>
        {results.map((card) => (
          <li key={card.id} style={{ listStyle: 'none' }}>
        <Link href={`/cards/${encodeURIComponent(card.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                <img src={card.image_uris?.small || ''} alt={card.name} style={{ width: '100%' }} />
                <p>{card.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
