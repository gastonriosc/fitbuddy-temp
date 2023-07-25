import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import User from 'src/models/userSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(400).json('El mail se encuentra registrado')
    }
    console.log(req.body)
    const user = await User.create(req.body)
    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(400).json('Usuario no registrado')
    }
  } catch (error) {
    res.status(400).json({ status: 'Not able to create a new user.' })
  }
}
