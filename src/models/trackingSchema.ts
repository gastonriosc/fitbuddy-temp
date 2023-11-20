import mongoose from 'mongoose'

const dataTrackingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  difficult: {
    type: Number,
    required: true
  },
  fatigue: {
    type: Number,
    required: true
  }
})

const trackingSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  data: [dataTrackingSchema]
})

const Tracking = mongoose.models.Tracking || mongoose.model('Tracking', trackingSchema)

export default Tracking
