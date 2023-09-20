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
    } else if (req.method === 'GET') {
      const { studentId } = req.query

      // Realiza una consulta para encontrar todos los planes asociados al studentId
      const plans = await PlanSchema.find({ studentId })

      if (plans) {
        return res.status(200).json(plans)
      } else {
        return res.status(404).json('No se encontraron planes para este alumno')
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 'Error interno del servidor' })
  }
}
