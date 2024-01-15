import mongoose from 'mongoose'

const dataInsightSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  deleted: {
    type: Boolean,
    required: true
  }
})

const InsightsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  dataOfItem: [dataInsightSchema]
})

const Insights = mongoose.models.Insights || mongoose.model('Insights', InsightsSchema)

export default Insights
