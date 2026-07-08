import { useState } from 'react'
import { useEvents } from '../context/EventContext.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { getImageUrl } from '../api'

const emptyForm = {
  title: '', category: 'Concert', date: '', time: '', venue: '',
  price: 0, seatsTotal: 100, organizer: '', description: '',
}

export default function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // multipart/form-data so the selected banner image file is uploaded and
    // stored on the server, instead of relying on a pasted image URL
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('category', form.category)
    formData.append('date', form.date)
    formData.append('time', form.time)
    formData.append('venue', form.venue)
    formData.append('price', Number(form.price))
    formData.append('seatsTotal', Number(form.seatsTotal))
    formData.append('organizer', form.organizer)
    formData.append('description', form.description)
    if (imageFile) formData.append('image', imageFile)

    try {
      if (editingId) {
        await updateEvent(editingId, formData)
        setEditingId(null)
      } else {
        await addEvent(formData)
      }
      setForm(emptyForm)
      setImageFile(null)
      setImagePreview('')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(event) {
    setEditingId(event.id)
    setForm({
      title: event.title, category: event.category, date: event.date, time: event.time,
      venue: event.venue, price: event.price, seatsTotal: event.seatsTotal,
      organizer: event.organizer, description: event.description,
    })
    setImageFile(null)
    setImagePreview(getImageUrl(event.image) || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
  }

  async function handleDelete(id) {
    setError('')
    try {
      await deleteEvent(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-5 mt-5 pt-4">
      <div className="mb-4">
        <p className="eyebrow mb-1">Manage events</p>
        <h1 className="h4 fw-bold mb-0">Manage your events</h1>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <GlassCard className="p-4">
            <h2 className="h6 fw-bold mb-3">{editingId ? 'Edit event' : 'Add a new event'}</h2>
            {error && <div className="alert alert-glass-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small">Event title</label>
                <input className="form-control glass-input" name="title" required
                  value={form.title} onChange={handleChange} />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small">Category</label>
                  <select className="form-select glass-input" name="category" value={form.category} onChange={handleChange}>
                    <option>Concert</option>
                    <option>Conference</option>
                    <option>College Fest</option>
                    <option>Workshop</option>
                    <option>Webinar</option>
                    <option>Entertainment</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small">Organizer</label>
                  <input className="form-control glass-input" name="organizer" required
                    value={form.organizer} onChange={handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small">Date</label>
                  <input type="date" className="form-control glass-input" name="date" required
                    value={form.date} onChange={handleChange} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small">Time</label>
                  <input type="time" className="form-control glass-input" name="time" required
                    value={form.time} onChange={handleChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small">Venue</label>
                <input className="form-control glass-input" name="venue" required
                  value={form.venue} onChange={handleChange} />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small">Price (₹, 0 = free)</label>
                  <input type="number" min="0" className="form-control glass-input" name="price"
                    value={form.price} onChange={handleChange} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small">Total seats</label>
                  <input type="number" min="1" className="form-control glass-input" name="seatsTotal"
                    value={form.seatsTotal} onChange={handleChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small">Banner image</label>
                <input type="file" accept="image/*" className="form-control glass-input"
                  name="image" onChange={handleImageChange} />
                <div className="form-text text-muted-light">
                  {editingId ? 'Leave empty to keep the current banner image.' : 'JPG or PNG, up to 5MB. Optional — a default banner is used if skipped.'}
                </div>
                {imagePreview && (
                  <div className="mt-2 image-preview-wrap">
                    <img src={imagePreview} alt="Banner preview" className="image-preview" />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label small">Description</label>
                <textarea className="form-control glass-input" name="description" rows="3" required
                  value={form.description} onChange={handleChange}></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary-glass flex-grow-1">
                  {editingId ? 'Save changes' : 'Publish event'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-glass" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-7">
          <GlassCard className="p-4">
            <h2 className="h6 fw-bold mb-3">Your events ({events.length})</h2>
            <div className="table-responsive">
              <table className="table table-glass align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ color: '#EEEEEE' }}>Event</th>
                    <th style={{ color: '#EEEEEE' }}>Date</th>
                    <th style={{ color: '#EEEEEE' }}>Seats left</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div style={{ color: '#EEEEEE' }}>{event.title}</div>
                        <div className="small text-muted-light">{event.category}</div>
                      </td>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{new Date(event.date).toLocaleDateString('en-IN')}</td>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{event.seatsAvailable}/{event.seatsTotal}</td>
                      <td className="text-end">
                        <button className="btn btn-icon-glass btn-sm me-1" onClick={() => handleEdit(event)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-icon-glass btn-sm btn-danger-icon" onClick={() => handleDelete(event.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
