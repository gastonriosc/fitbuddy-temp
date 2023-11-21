// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import PlanModel from 'src/models/planSchema'
import mongoose from 'mongoose'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()
  if (req.method === 'GET') {
    const id = req.query.id
    const objectId = new mongoose.Types.ObjectId(id)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 0)
    console.log(startDate, endDate)

    try {
      const montosMensuales = await PlanModel.aggregate([
        {
          $match: {
            trainerId: objectId,
            date: {
              $gte: startDate,
              $lte: endDate
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
      if (montosMensuales) {
        const responseData = {
          montosMensuales: montosMensuales
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
