const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'Concert' },
    date: { type: String, required: true }, // 'YYYY-MM-DD' to match the frontend
    time: { type: String, required: true }, // 'HH:MM'
    venue: { type: String, required: true },
    price: { type: Number, default: 0 },
    seatsTotal: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    image: { type: String, default: '' },
    organizer: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

// Expose Mongo's _id as a plain "id" string, so the frontend doesn't need to change
eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Event', eventSchema)
