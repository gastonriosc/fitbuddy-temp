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

    // const currentMonth = new Date().getMonth()
    // const currentYear = new Date().getFullYear()

    // const startDateM = new Date(currentYear, currentMonth, 1)
    // const endDateM = new Date(currentYear, currentMonth + 1, 0)
    // const startDateA = new Date(currentYear, 0, 1)
    // const endDateA = new Date(currentYear, 11, 31)

    try {
      const dataTracking = await PlanModel.aggregate([
        {
          $match: {
            studentId: objectId
          }
        },
        {
          $lookup: {
            from: 'trackings',
            localField: '_id',
            foreignField: 'planId',
            as: 'tracking_info'
          }
        },
        {
          $unwind: '$tracking_info'
        },
        {
          $project: {
            dataTracking: '$tracking_info.data.date'
          }
        }
      ])
      if (dataTracking && dataTracking.length > 0) {
        const combinedDates = dataTracking.reduce((acc, curr) => acc.concat(curr.dataTracking), [])

        const responseData = {
          dataTracking: combinedDates
        }
        console.log(responseData)

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
