import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    default: null
  },
  rol: {
    type: String,
    default: null,
    required: true
  },
  typeWorkout: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  }
})

const User = mongoose.models.User || mongoose.model('User', usersSchema)

export default User
