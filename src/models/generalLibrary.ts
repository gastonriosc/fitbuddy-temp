import mongoose from 'mongoose'

const exercisesSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true
  },
  muscleGroup: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  linkExercise: {
    type: String,
    required: true
  }
})

const generalLibrarySchema = new mongoose.Schema({
  exercises: [exercisesSchema]
})

const GeneralLibrary = mongoose.models.GeneralLibrary || mongoose.model('GeneralLibrary', generalLibrarySchema)

export default GeneralLibrary
