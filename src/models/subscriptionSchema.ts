import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  trainerId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  deleted: {
    type: Boolean,
    require: true
  }
})

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)

export default Subscription
