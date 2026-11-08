const Card = ({ title, value, subtitle, color }) => {
  return (
    <div className="card" style={{ borderTop: `2px solid ${color || 'var(--accent-primary)'}` }}>
      <p className="card-title">{title}</p>
      <h2 className="card-value">{value}</h2>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
  );
};

export default Card;
