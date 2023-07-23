import mongoose, { ConnectionStates } from 'mongoose'

const connection = {
  isConnected: false
}

async function connect() {
  if (connection.isConnected) {
    return
  }
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está definida.')
  }
  const db = await mongoose.connect(uri)

  connection.isConnected = db.connections[0].readyState === ConnectionStates.connected
}

export default connect
