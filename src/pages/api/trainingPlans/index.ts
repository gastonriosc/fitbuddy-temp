import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import PlanSchema from 'src/models/planSchema' // Importa el modelo de usuario

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()
    if (req.method === 'POST') {
      const plans = await PlanSchema.create(req.body)

      if (plans) {
        return res.status(200).json(plans)
      } else {
        return res.status(400).json('No se pudo crear el plan')
      }
    }
  } catch (error) {
    return res.status(400).json({ status: 'No se pudo crear el plan.' })
  }
}
