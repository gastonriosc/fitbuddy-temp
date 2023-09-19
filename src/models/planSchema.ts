import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
  nombreEjercicio: String,
  series: Number,
  repeticiones: Number,
  peso: Number
})

const daySchema = new mongoose.Schema({
  nombreDia: String,
  Ejercicios: [exerciseSchema]
})

const planSchema = new mongoose.Schema({
  nombrePlan: String,
  plan: [daySchema],
  trainerId: mongoose.Schema.ObjectId,
  studentId: mongoose.Schema.ObjectId
})

const PlanModel = mongoose.models.Plan || mongoose.model('Plan', planSchema)

export default PlanModel
