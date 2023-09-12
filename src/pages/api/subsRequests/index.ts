import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import SubsRequest from 'src/models/subsRequestSchema'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()
  try {
    if (req.method === 'POST') {
      const subsRequest = await SubsRequest.create(req.body)
      if (subsRequest) {
        return res.status(200).json(subsRequest)
      } else {
        return res.status(400).json('No se puedo crear la solicitud de suscripcion')
      }
    }
    if (req.method === 'GET') {
      try {
        const { id } = req.query
        const objectId = new mongoose.Types.ObjectId(id)

        console.log(id)

        const subsRequest = await SubsRequest.aggregate([
          {
            $match: {
              trainerId: objectId,
              status: 'pendiente'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'studentId',
              foreignField: '_id',
              as: 'student_info'
            }
          },
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'subscriptionId',
              foreignField: '_id',
              as: 'subscription_info'
            }
          },
          {
            $unwind: '$student_info'
          },
          {
            $unwind: '$subscription_info'
          },
          {
            $project: {
              _id: 1,
              description: 1,
              status: 1,
              trainerId: 1,
              studentId: 1,
              subscriptionId: 1,
              date: 1,
              studentName: '$student_info.name',
              subscriptionName: '$subscription_info.name'
            }
          }
        ])

        console.log(subsRequest)
        if (subsRequest) {
          const responseData = {
            subsRequest: subsRequest
          }

          return res.status(200).json(responseData)
        } else {
          return res.status(404).json({ message: 'No se encontro el usuario' })
        }
      } catch (error) {
        console.error('Error finding user:', error)

        return res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  } catch (error) {
    res.status(400).json({ status: 'No se puedieron cargar las solicitudes.' })
  }
}
