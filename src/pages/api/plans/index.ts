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
        const { subsReq } = req.query
        const objectId = new mongoose.Types.ObjectId(subsReq)

        const daysPerWeek = await SubsRequest.aggregate([
          {
            $match: {
              _id: objectId
            }
          },
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'subscriptionId',
              foreignField: '_id',
              as: 'subs_info'
            }
          },
          {
            $unwind: '$subs_info'
          },
          {
            $project: {
              daysPerWeek: '$subs_info.daysPerWeek'
            }
          }
        ])
        if (daysPerWeek) {
          const responseData = {
            daysPerWeek: daysPerWeek
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
