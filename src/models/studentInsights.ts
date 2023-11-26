import mongoose from 'mongoose'

const dataInsightSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true
  }
})

const studentInsightsSchema = new mongoose.Schema({
  data: [dataInsightSchema]
})

const StudentInsights = mongoose.models.studentInsights || mongoose.model('StudentInsights', studentInsightsSchema)

export default StudentInsights
