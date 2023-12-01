import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import TrackingSchema from 'src/models/trackingSchema'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    if (req.method === 'GET') {
      const { id } = req.query
      const objectId = new mongoose.Types.ObjectId(id)

      const pipeline = [
        {
          $match: {
            _id: objectId // Filtra por el ID de seguimiento
          }
        },
        {
          $lookup: {
            from: 'plans',
            localField: 'planId',
            foreignField: '_id',
            as: 'plan_info'
          }
        },
        {
          $unwind: '$plan_info'
        },
        {
          $project: {
            _id: 1,
            planId: 1,
            data: 1,
            date: '$plan_info.date',
            expirationDate: '$plan_info.expirationDate'
          }
        }
      ]

      const tracking = await TrackingSchema.aggregate(pipeline)

      if (tracking.length > 0) {
        return res.status(200).json(tracking[0])
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
    } else if (req.method === 'DELETE') {
      const { id, data } = req.body

      try {
        const updatedTracking = await TrackingSchema.findByIdAndUpdate(id, { $pull: { data: data } }, { new: true })

        if (updatedTracking) {
          return res.status(200).json(updatedTracking)
        } else {
          return res.status(404).json({ error: 'No se pudo eliminar el registro' })
        }
      } catch (error) {
        console.error(error)

        return res.status(500).json({ status: 'Error interno del servidor' })
      }
    } else {
      return res.status(405).json({ error: 'Método no permitido' })
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'Error interno del servidor' })
  }
}
