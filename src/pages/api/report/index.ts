// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import Tracking from 'src/models/trackingSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  if (req.method === 'GET') {
    try {
      const { id } = req.query
      const user = await Tracking.findOne({ planId: id })

      if (user) {
        const { _id, planId, finalReport, data } = user

        return res.status(200).json({ _id, planId, finalReport, data })
      } else {
        return res.status(404).json({ message: 'No se encontró el usuario' })
      }
    } catch (error) {
      console.error('Error finding user:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { planId, observations, progress, trainerSupport, recommendations } = req.body

      const updatedTracking = await Tracking.findOneAndUpdate(
        { planId: planId },
        {
          $push: {
            finalReport: {
              observations: observations,
              progress: progress,
              trainerSupport: trainerSupport,
              recommendations: recommendations
            }
          }
        },
        { new: true }
      )

      if (updatedTracking) {
        return res.status(200).json({ message: 'Observations updated successfully' })
      } else {
        return res.status(404).json({ message: 'No se encontró el usuario' })
      }
    } catch (error) {
      console.error('Error updating observations:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default handler
