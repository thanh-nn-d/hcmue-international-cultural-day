export default function InfoItem({ icon, title, value }) {
  return (
    <div className="info-item">
      <div className="info-icon">{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
