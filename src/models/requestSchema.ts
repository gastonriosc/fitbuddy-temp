import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  trainerId: {
    type: String,
    require: true
  },
  studentId: {
    type: String,
    require: true
  },
  subscriptionId: {
    type: String,
    require: true
  }
})

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema)

export default Request
