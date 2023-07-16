import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI debe estar definida')
}

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI)
    if (connection.readyState === 1) {
      return Promise.resolve(true)
    }
  } catch (error) {
    console.log(error)

    return Promise.reject(false)
  }
}
