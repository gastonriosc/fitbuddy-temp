import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'

connect()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar si el correo electrónico ya existe en la base de datos
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.send(
        'El mail ingresado ya existe, por favor ingrese uno que no exista para poder registrarse correctamente.'
      )
    }

    // El correo electrónico no existe, crear el nuevo usuario
    const user = await User.create(req.body)

    res.redirect('/')
    if (!user) {
      return res.json({ code: 'User not created' })
    }
  } catch (error) {
    res.status(400).json({ status: 'Not able to create a new user.' })
  }
}
