// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'
import PlanModel from 'src/models/planSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()
  if (req.method === 'GET') {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const startDateM = new Date(currentYear, currentMonth, 1)
    const endDateM = new Date(currentYear, currentMonth + 1, 0)
    const startDateA = new Date(currentYear, 0, 1)
    const endDateA = new Date(currentYear, 11, 31)

    try {
      const newUsers = await User.find(
        { registrationDate: { $gte: startDateA, $lte: endDateA } },
        'role registrationDate'
      )
      const montosMensuales = await PlanModel.aggregate([
        {
          $match: {
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

      if (newUsers && montosMensuales && montosAnuales) {
        const responseData = {
          montosMensuales: montosMensuales,
          montosAnuales: montosAnuales,
          newUsers: newUsers
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
