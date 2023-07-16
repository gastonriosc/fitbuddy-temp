import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
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
  birthday: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    default: null
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

const User = models.User || model('User', userSchema)

export default User
