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
      <p>{card.oracle_text}</p>
      <p>Price (USD): ${card.prices.usd}</p>
      <a href="/">Search another card</a>
    </div>
  );
}
