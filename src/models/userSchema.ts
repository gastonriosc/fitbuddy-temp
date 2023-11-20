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
  phone: {
    type: Number,
    default: null
  },
  role: {
    type: String,
    default: null,
    required: true
  },
  discipline: {
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
  },
  avatar: {
    type: String,
    require: true
  },
  height: {
    type: String,
    default: null
  },
  weight: {
    type: String,
    default: null
  }
})

const User = mongoose.models.User || mongoose.model('User', usersSchema)

export default User
