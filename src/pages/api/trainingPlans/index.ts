import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import PlanSchema from 'src/models/planSchema'
import SubsRequest from 'src/models/subsRequestSchema'
import TrackingSchema from 'src/models/trackingSchema'
import mongoose from 'mongoose'
import PlanModel from 'src/models/planSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()

    if (req.method === 'POST') {
      const { subsRequestId } = req.body

      const subsRequest = await SubsRequest.findByIdAndUpdate(subsRequestId, { status: 'conPlan' })
      const plans = await PlanSchema.create(req.body)
      const tracking = await TrackingSchema.create({ planId: plans._id })

      if (plans && subsRequest && tracking) {
        return res.status(200).json(plans)
      } else {
        return res.status(400).json('No se pudo crear el plan')
      }
    } else if (req.method === 'GET') {
      const { id } = req.query

      try {
        const plan = await PlanSchema.findOne({ _id: id })
        const trackingId = await TrackingSchema.findOne({ planId: plan._id }, { _id: 1 })
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
              trainerId: 1,
              studentId: 1,
              subsRequestId: 1,
              trainerName: '$trainer_info.name'
            }
          }
        ])

        if (combinedInfo.length > 0 && trackingId) {
          const data = {
            combinedInfo: combinedInfo[0],
            trackingId: trackingId
          }

          return res.status(200).json(data)
        } else {
          return res.status(404).json('No se encontraron planes para este alumno')
        }
      } catch (error) {
        console.error(error)

        return res.status(500).json({ status: 'Error interno del servidor' })
      }
    } else if (req.method === 'PUT') {
      const { id } = req.query
      const { plan } = req.body

      try {
        const updatedPlan = await PlanSchema.findByIdAndUpdate(id, { plan }, { new: true })

        if (updatedPlan) {
          return res.status(200).json(updatedPlan)
        } else {
          return res.status(404).json({ error: 'No se pudo actualizar el plan' })
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
