// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import PlanModel from 'src/models/planSchema'
import mongoose from 'mongoose'
import SubsRequest from 'src/models/subsRequestSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()
  if (req.method === 'GET') {
    const id = req.query.id
    const objectId = new mongoose.Types.ObjectId(id)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const startDateM = new Date(currentYear, currentMonth, 1)
    const endDateM = new Date(currentYear, currentMonth + 1, 0)

    try {
      const montosMensuales = await PlanModel.aggregate([
        {
          $match: {
            trainerId: objectId,
            date: {
              $gte: startDateM,
              $lte: endDateM
            }
          }
        },
        {
          $lookup: {
            from: 'subsrequests',
            localField: 'subsRequestId',
            foreignField: '_id',
            as: 'subRequest_info'
          }
        },
        {
          $unwind: '$subRequest_info'
        },
        {
          $project: {
            date: 1,
            amount: '$subRequest_info.amount'
          }
        }
      ])
      const montosAnuales = await PlanModel.aggregate([
        {
          $match: {
            trainerId: objectId
          }
        },
        {
          $lookup: {
            from: 'subsrequests',
            localField: 'subsRequestId',
            foreignField: '_id',
            as: 'subRequest_info'
          }
        },
        {
          $unwind: '$subRequest_info'
        },
        {
          $project: {
            date: 1,
            amount: '$subRequest_info.amount'
          }
        }
      ])
      const subsMasSolicitadas = await SubsRequest.aggregate([
        {
          $match: {
            trainerId: objectId
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
          $unwind: '$subscription_info'
        },
        {
          $project: {
            date: 1,
            subscriptionId: 1,
            subsName: '$subscription_info.name'
          }
        }
      ])

      if (montosMensuales && montosAnuales && subsMasSolicitadas) {
        const responseData = {
          montosMensuales: montosMensuales,
          montosAnuales: montosAnuales,
          subsMasSolicitadas: subsMasSolicitadas
        }

        return res.status(200).json(responseData)
      } else {
        return res.status(404).json({ message: 'No se encontro el usuario' })
      }
    } catch (error) {
      console.error('Error finding user:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido.' })
  }
}

export default handler
