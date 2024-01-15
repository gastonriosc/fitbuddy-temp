import mongoose from 'mongoose'

const studentInsightsSchema = new mongoose.Schema({
  studentId: mongoose.Schema.ObjectId,
  data: [mongoose.Schema.ObjectId]
})

const StudentInsights = mongoose.models.StudentInsights || mongoose.model('StudentInsights', studentInsightsSchema)

export default StudentInsights
