import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  }
})

const foroSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  messages: [messageSchema]
})

const Foro = mongoose.models.Foro || mongoose.model('Foro', foroSchema)

export default Foro
