import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import User from 'src/models/userSchema'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(409).json('Email ya registrado')
    }

    const user = req.body

    if (user.role === 'Entrenador') {
      user.trainerId = new mongoose.Types.ObjectId() // Genera un ObjectId para trainerId
      user.studentId = null
    } else {
      user.studentId = new mongoose.Types.ObjectId() // Genera un ObjectId para studentId
    }

    const createdUser = await User.create(user)

    if (createdUser) {
      return res.status(200).json(createdUser)
    } else {
      return res.status(400).json('No se pudo registrar el usuario')
    }
  } catch (error) {
    res.status(400).json({ status: 'No se pudo crear un nuevo usuario.' })
  }
}
