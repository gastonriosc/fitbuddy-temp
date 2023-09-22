import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import PlanSchema from 'src/models/planSchema' // Importa el modelo de usuario
import SubsRequest from 'src/models/subsRequestSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect()
    if (req.method === 'POST') {
      const { subsRequestId } = req.body

      const subsRequest = await SubsRequest.findByIdAndUpdate(subsRequestId, { status: 'conPlan' })
      const plans = await PlanSchema.create(req.body)
      if (plans && subsRequest) {
        return res.status(200).json(plans)
      } else {
        return res.status(400).json('No se pudo crear el plan')
      }
    } else if (req.method === 'GET') {
      const { id } = req.query

      // Realiza una consulta para encontrar todos los planes asociados al studentId
      const plan = await PlanSchema.findOne({ _id: id })

      if (plan) {
        return res.status(200).json(plan)
      } else {
        return res.status(404).json('No se encontraron planes para este alumno')
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 'Error interno del servidor' })
  }
}
