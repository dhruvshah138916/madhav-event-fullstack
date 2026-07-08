export default function Footer() {
  return (
    <footer className="site-footer mt-5">
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div className="brand small">
          <i className="bi bi-ticket-perforated-fill me-2"></i>
          Madhav<span className="brand-accent">Event</span>
        </div>
        <p className="mb-0 small text-muted-light">
          This Website Created By Dhruv Mehul Shah.
        </p>
        <p className="mb-0 small text-muted-light">© {new Date().getFullYear()} Madhav Event</p>
      </div>
    </footer>
  )
}
