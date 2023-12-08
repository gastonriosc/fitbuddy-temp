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

const finalReportSchema = new mongoose.Schema({
  observations: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  trainerSupport: {
    type: Number,
    required: true
  },
  recommendations: {
    type: Number,
    required: true
  }
})

const trackingSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  data: [dataTrackingSchema],
  finalReport: [finalReportSchema]
})

const Tracking = mongoose.models.Tracking || mongoose.model('Tracking', trackingSchema)

export default Tracking
