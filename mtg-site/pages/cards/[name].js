export async function getServerSideProps(context) {
  const { name } = context.params;
  const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`);
  const card = await res.json();

  return {
    props: { card },
  };
}

export default function CardPage({ card }) {
  if (card.object === 'error') {
    return <div>Card not found. Try another name.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{card.name}</h1>
        <img src={card.image_uris?.normal} alt={card.name} />
      <h3>Card Details</h3>
        <p>{card.oracle_text}</p>
      <h3>Mana Cost</h3>
        <p>{card.mana_cost}</p>
      <h3>Keywords</h3>
        <p>{card.keywords.join(', ')}</p>
      <h3>Set Information</h3>
        <p>{card.set_name}</p>
      <h3>Prices:</h3>
        <ul>
            <li>TCGPlayer (USD): ${card.prices.usd || 'N/A'}</li>
            <li>Cardmarket (EUR): €{card.prices.eur || 'N/A'}</li>
        </ul>
      <a href="/">Search another card</a>
    </div>
  );
}
