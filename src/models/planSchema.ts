import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
  nombreEjercicio: String,
  series: Number,
  repeticiones: Number,
  peso: Number,
  link: String
})

const daySchema = new mongoose.Schema({
  nombreDia: String,
  Ejercicios: [exerciseSchema]
})

const planSchema = new mongoose.Schema({
  nombrePlan: String,
  plan: [daySchema],
  trainerId: mongoose.Schema.ObjectId,
  studentId: mongoose.Schema.ObjectId,
  subsRequestId: mongoose.Schema.ObjectId,
  date: {
    type: Date,
    require: true
  },
  expirationDate: {
    type: Date,
    require: true
  },
  amount: {
    type: Number,
    require: true
  }
})

const PlanModel = mongoose.models.Plan || mongoose.model('Plan', planSchema)

export default PlanModel
