import mongoose from 'mongoose'

const myExercisesSchema = new mongoose.Schema({
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

const myLibrarySchema = new mongoose.Schema({
  exercises: [myExercisesSchema]
})

const MyLibrary = mongoose.models.MyLibrary || mongoose.model('MyLibrary', myLibrarySchema)

export default MyLibrary
