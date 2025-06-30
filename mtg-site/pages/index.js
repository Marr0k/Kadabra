import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentCards, setRecentCards] = useState([]);
  const router = useRouter();

  // Fetch autocomplete suggestions from Scryfall
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.data);
      setShowDropdown(true);
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce by 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let recent = JSON.parse(localStorage.getItem('recentCards') || '[]');
      // Migrate string entries to object format
      recent = recent.map((entry) => {
        if (typeof entry === 'string') {
          return { name: entry, image: '' }; // image will be blank for old entries
        }
        return entry;
      });
      setRecentCards(recent);
      // Optionally, update localStorage to new format
      localStorage.setItem('recentCards', JSON.stringify(recent));
    }
  }, []);

  const handleSelect = (name) => {
    setQuery(name);
    setShowDropdown(false);
    router.push(`/cards/${encodeURIComponent(name)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cards/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Search for a Magic: The Gathering Card</h1>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          placeholder="Type card name..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Search</button>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '3rem',
              left: 0,
              background: '#000000',
              border: '1px solid #ccc',
              width: '300px',
              maxHeight: '200px',
              overflowY: 'auto',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 10,
            }}
          >
            {suggestions.map((name) => (
              <li
                key={name}
                onClick={() => handleSelect(name)}
                style={{
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Recently Viewed Cards Section */}
      {recentCards.length > 0 && (
        <div style={{ marginTop: '2rem', background: '#222', padding: '1rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#fff' }}>Recently Viewed Cards</h2>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
            {recentCards.map((card) => (
              <li key={card.name} style={{ textAlign: 'center' }}>
                <a href={`/cards/${encodeURIComponent(card.name)}`} style={{ color: '#61dafb', textDecoration: 'none' }}>
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      style={{ width: '80px', height: '112px', display: 'block', margin: '0 auto 0.5rem auto', borderRadius: '4px' }}
                    />
                  )}
                  <span>{card.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ height: '1500px', background: '#000000' }}>
        <p style={{ color: '#ffffff', padding: '1rem' }}>
          Start Typing...
        </p>
      </div>
    </div>
  );
}
