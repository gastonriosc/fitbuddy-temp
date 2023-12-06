import mongoose from 'mongoose'

const subsRequestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  trainerId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  subscriptionId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  disease: {
    type: String,
    require: true
  }
})

const SubsRequest = mongoose.models.SubsRequest || mongoose.model('SubsRequest', subsRequestSchema)

export default SubsRequest
