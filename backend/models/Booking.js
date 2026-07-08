const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true }, // the booked Event's _id, as a string
    eventTitle: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    venue: { type: String, required: true },
    userEmail: { type: String, required: true },
    attendeeName: { type: String, required: true },
    seats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookedAt: { type: String, required: true },
    status: { type: String, default: 'Confirmed' },
  },
  { timestamps: true },
)

bookingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Booking', bookingSchema)
