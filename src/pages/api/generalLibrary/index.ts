import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import GeneralLibrary from 'src/models/generalLibrary'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    if (req.method === 'POST') {
      // Logic to handle POST requests
      const exerciseLibrary = await GeneralLibrary.create(req.body)
      if (exerciseLibrary) {
        return res.status(200).json(exerciseLibrary)
      } else {
        return res.status(404).json('No se pudo crear la solicitud de suscripcion')
      }
    } else if (req.method === 'GET') {
      // Logic to handle GET requests
      const exerciseLibrary = await GeneralLibrary.findOne()

      const responseData = {
        exercisesData: exerciseLibrary
      }

      return res.status(200).json(responseData)
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (error) {
    console.error('Error:', error)

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
