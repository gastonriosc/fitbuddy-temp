import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import PlanSchema from 'src/models/planSchema'
import SubsRequest from 'src/models/subsRequestSchema'
import mongoose from 'mongoose'
import PlanModel from 'src/models/planSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    if (req.method === 'POST') {
      const { subsRequestId } = req.body

      const subsRequest = await SubsRequest.findByIdAndUpdate(subsRequestId, { status: 'conPlan' })
      const plans = await PlanSchema.create(req.body)

      if (plans && subsRequest) {
        return res.status(200).json(plans)
      } else {
        return res.status(400).json('No se pudo crear el plan')
      }
    } else if (req.method === 'GET') {
      const { id } = req.query

      try {
        const objectId = new mongoose.Types.ObjectId(id)

        const combinedInfo = await PlanModel.aggregate([
          {
            $match: {
              _id: objectId
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
            $unwind: '$trainer_info'
          },
          {
            $project: {
              _id: 1,
              nombrePlan: 1,
              plan: 1,
              date: 1,
              expirationDate: 1,
              trainerName: '$trainer_info.name'
            }
          }
        ])

        if (combinedInfo.length > 0) {
          return res.status(200).json(combinedInfo[0])
        } else {
          return res.status(404).json('No se encontraron planes para este alumno')
        }
      } catch (error) {
        console.error(error)

        return res.status(500).json({ status: 'Error interno del servidor' })
      }
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ status: 'Error interno del servidor' })
  }
}
