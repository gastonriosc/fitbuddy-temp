import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import SubsRequest from 'src/models/subsRequestSchema'
import mongoose from 'mongoose'
import Subscription from 'src/models/subscriptionSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()
  try {
    if (req.method === 'GET') {
      try {
        const { id } = req.query
        const objectId = new mongoose.Types.ObjectId(id)

        const subsRequest = await SubsRequest.aggregate([
          {
            $match: {
              studentId: objectId,
              status: 'rechazada'
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
              from: 'users',
              localField: 'trainerId',
              foreignField: '_id',
              as: 'trainer_info'
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
            $unwind: '$trainer_info'
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
              expirationDate: 1,
              amount: 1,
              disease: 1,
              studentName: '$student_info.name',
              trainerName: '$trainer_info.name',
              subscriptionName: '$subscription_info.name',
              avatar: '$student_info.avatar',
              trainerAvatar: '$trainer_info.avatar',
              subscriptionDaysPerWeek: '$subscription_info.daysPerWeek',
              subscriptionFollowing: '$subscription_info.following',
              subscriptionPrice: '$subscription_info.price',
              subscriptionIntensity: '$subscription_info.intensity',
              subscriptionDescription: '$subscription_info.description',
              rejectionReason: 1
            }
          }
        ])
        const nameSubs = await Subscription.find({ trainerId: id, deleted: false }, 'name')
        if (subsRequest) {
          const responseData = {
            subsRequest: subsRequest,
            nameSubs: nameSubs
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
    res.status(404).json({ status: 'No se puedieron cargar las solicitudes.' })
  }
}
