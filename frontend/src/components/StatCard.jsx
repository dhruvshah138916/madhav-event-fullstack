export default function StatCard({ icon, label, value, accent }) {
  return (
    <div className="glass-card stat-card">
      <div className={`stat-icon ${accent ? 'stat-icon-accent' : ''}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <p className="stat-value mb-0">{value}</p>
        <p className="stat-label mb-0">{label}</p>
      </div>
    </div>
  )
}
