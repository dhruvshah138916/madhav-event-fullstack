const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['attendee', 'organizer'], default: 'attendee' },
  },
  { timestamps: true },
)

// Expose Mongo's _id as a plain "id" string, hide internal/sensitive fields
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)
