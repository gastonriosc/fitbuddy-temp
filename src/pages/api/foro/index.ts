import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import mongoose from 'mongoose'
import Foro from 'src/models/foroSchema'
import PlanModel from 'src/models/planSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()
  try {
    if (req.method === 'POST') {
      const { planId, messages } = req.body

      let foro = await Foro.findOne({ planId })
      if (!foro) {
        foro = await Foro.create({
          planId: planId,
          messages: messages
        })
      } else {
        foro.messages.push(...messages)
      }
      await foro.save()

      return res.status(200).json(foro)
    }

    if (req.method === 'GET') {
      try {
        const { id } = req.query
        const objectId = new mongoose.Types.ObjectId(id)

        const infoPlan = await PlanModel.aggregate([
          {
            $match: {
              _id: objectId
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
            $unwind: '$student_info'
          },
          {
            $unwind: '$trainer_info'
          },
          {
            $project: {
              studentName: '$student_info.name',
              trainerName: '$trainer_info.name',
              studentAvatar: '$student_info.avatar',
              trainerAvatar: '$trainer_info.avatar',
              expirationDate: '$expirationDate'
            }
          }
        ])
        const foro = await Foro.findOne({ planId: id })

        if (infoPlan) {
          const responseData = {
            foro: foro,
            infoPlan: infoPlan
          }

          return res.status(200).json(responseData)
        }
      } catch (error) {
        console.error('Error finding foro:', error)

        return res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  } catch (error) {
    res.status(404).json({ status: 'No se puedieron cargar las solicitudes.' })
  }
}
