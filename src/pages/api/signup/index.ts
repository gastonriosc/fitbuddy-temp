import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import User from 'src/models/userSchema'
import StudentInsights from 'src/models/studentInsights'
import Insights from 'src/models/insight'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(409).json('Email ya registrado')
    }
    const user = await User.create(req.body)
    if (user.role == 'Alumno') {
      const currentDate = new Date()
      const insight = await Insights.create({
        name: 'Peso Corporal',
        dataOfItem: {
          date: currentDate,
          weight: user.weight,
          deleted: false
        }
      })
      await StudentInsights.create({
        studentId: user._id,
        data: [insight._id]
      })
    }
    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(400).json('No se puedo registrar el usuario')
    }
  } catch (error) {
    res.status(400).json({ status: 'Not able to create a new user.' })
  }
}
