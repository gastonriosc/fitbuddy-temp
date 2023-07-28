// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  try {
    const users = await User.find({ role: 'Entrenador' })

    if (users && users.length > 0) {
      return res.status(200).json(users)
    } else {
      return res.status(404).json({ message: 'No se encontraron usuarios' })
    }
  } catch (error) {
    console.error('Error finding users:', error)

    return res.status(500).json({ message: 'Error' })
  }
}

export default handler
