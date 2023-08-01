// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  if (req.method === 'PUT') {
    try {
      const { email, ...updatedData } = req.body

      const existingUser = await User.findOne({ email })

      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Actualiza los campos del usuario con los datos nuevos
      for (const [key, value] of Object.entries(updatedData)) {
        existingUser[key] = value
      }

      const updatedUser = await existingUser.save()

      if (updatedUser) {
        return res.status(200).json(updatedUser)
      } else {
        return res.status(400).json({ message: 'No se pudo actualizar el usuario' })
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)

      return res.status(500).json({ message: 'Error del servidor al actualizar el usuario' })
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido.' })
  }
}

export default handler
