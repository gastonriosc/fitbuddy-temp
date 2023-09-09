// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import Subscription from 'src/models/subscriptionSchema'
import User from 'src/models/userSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      debugger
      const user = await User.findOne({ _id: id })
      const subs = await Subscription.find({ trainerId: id, deleted: false })
      if (user) {
        const responseData = {
          user: user,
          subs: subs
        }

        return res.status(200).json(responseData)
      } else {
        return res.status(404).json({ message: 'No se encontro el usuario' })
      }
    } catch (error) {
      console.error('Error finding user:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido.' })
  }
}

export default handler
