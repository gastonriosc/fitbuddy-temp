import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import mongoose from 'mongoose'
import PlanModel from 'src/models/planSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()
  try {
    if (req.method === 'GET') {
      try {
        const { id } = req.query
        const objectId = new mongoose.Types.ObjectId(id)

        const plan = await PlanModel.aggregate([
          {
            $match: {
              studentId: objectId
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
              from: 'subsrequests',
              localField: 'subsRequestId',
              foreignField: '_id',
              as: 'subsRequest_info'
            }
          },
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'subsRequest_info.subscriptionId',
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
            $unwind: '$subsRequest_info'
          },
          {
            $unwind: '$subscription_info'
          },
          {
            $project: {
              _id: 1,
              nombrePlan: 1,
              trainerId: 1,
              studentId: 1,
              subsRequestId: 1,
              date: 1,
              expirationDate: 1,
              studentName: '$student_info.name',
              trainerName: '$trainer_info.name',
              subscriptionName: '$subscription_info.name',
              avatar: '$trainer_info.avatar'
            }
          }
        ])

        // const nameSubs = await Subscription.find({ trainerId: id, deleted: false }, 'name')
        if (plan) {
          const responseData = {
            plan: plan

            // nameSubs: nameSubs
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
