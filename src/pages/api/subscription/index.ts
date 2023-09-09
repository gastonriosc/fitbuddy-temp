import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import Subscription from 'src/models/subscriptionSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()
    if (req.method === 'POST') {
      const subscription = await Subscription.create(req.body)
      if (subscription) {
        return res.status(200).json(subscription)
      } else {
        return res.status(400).json('No se puedo crear la suscripcion')
      }
    }
    if (req.method === 'PUT') {
      const { subsId, ...updatedData } = req.body

      const subscription = await Subscription.findOne({ _id: subsId })

      if (!subscription) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Actualiza los campos del usuario con los datos nuevos
      for (const [key, value] of Object.entries(updatedData)) {
        subscription[key] = value
      }

      const updatedSub = await subscription.save()

      if (updatedSub) {
        return res.status(200).json(updatedSub)
      } else {
        return res.status(400).json({ message: 'No se pudo actualizar el usuario' })
      }
    }
  } catch (error) {
    res.status(400).json({ status: 'Not able to create a new user.' })
  }
}
