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

const studentInsightsSchema = new mongoose.Schema({
  studentId: mongoose.Schema.ObjectId,
  data: [dataInsightSchema]
})

const StudentInsights = mongoose.models.StudentInsights || mongoose.model('StudentInsights', studentInsightsSchema)

export default StudentInsights
