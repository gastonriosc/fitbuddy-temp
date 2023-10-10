import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import TrackingSchema from 'src/models/trackingSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    if (req.method === 'GET') {
      const { id } = req.query

      const tracking = await TrackingSchema.findOne({ _id: id })

      if (tracking) {
        return res.status(200).json(tracking)
      } else {
        return res.status(404).json('No se encontraron registros para este alumno')
      }
    } else if (req.method === 'PUT') {
      const { id, data } = req.body
      const updatedTracking = await TrackingSchema.findByIdAndUpdate(
        id,
        { $push: { data: { $each: [data] } } },
        { new: true }
      )

      if (updatedTracking) {
        return res.status(200).json(updatedTracking)
      } else {
        return res.status(404).json({ error: 'No se pudo actualizar el plan' })
      }
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'Error interno del servidor' })
  }
}
