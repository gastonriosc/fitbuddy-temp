import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import MyLibrary from 'src/models/myLibrary'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    if (req.method === 'POST') {
      const exerciseLibrary = await MyLibrary.create(req.body)
      if (exerciseLibrary) {
        return res.status(200).json(exerciseLibrary)
      } else {
        return res.status(404).json('No se pudo crear la libreria de ejercicios.')
      }
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (error) {
    console.error('Error:', error)

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
