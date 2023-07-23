// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email, password })

    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(404).json({ message: 'Email or Password is invalid hola' })
    }
  } catch (error) {
    console.error('Error finding user:', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
