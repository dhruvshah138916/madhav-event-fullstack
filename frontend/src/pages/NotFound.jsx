import { Link } from 'react-router-dom'
import GlassCard from '../components/GlassCard.jsx'

export default function NotFound() {
  return (
    <div className="container py-5 mt-5 text-center">
      <GlassCard className="p-5 mx-auto" style={{ maxWidth: 480 }}>
        <i className="bi bi-signpost-split display-4 d-block mb-3 text-muted-light"></i>
        <h1 className="h4 fw-bold mb-2">Page not found</h1>
        <p className="text-muted-light mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary-glass btn-sm">Back to events</Link>
      </GlassCard>
    </div>
  )
}
