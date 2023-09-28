import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import mongoose from 'mongoose'
import Foro from 'src/models/foroSchema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()
  try {
    if (req.method === 'POST') {
      const { planId, newMessage } = req.body
      console.log(req.body)
      let foro = await Foro.findOne({ planId })
      if (!foro) {
        foro = await Foro.create({
          planId: planId,
          messages: [newMessage]
        })
      } else {
        foro.messages.push(newMessage)
      }
      await foro.save()

      return res.status(200).json(foro)
    }

    // if (req.method === 'PUT') {
    //   const { requestId, status } = req.body
    //   const subsRequest = await SubsRequest.findByIdAndUpdate(requestId, { status }, { new: true })
    //   if (subsRequest) {
    //     return res.status(200).json(subsRequest)
    //   } else {
    //     return res.status(404).json('no se puedo realizar el update')
    //   }
    // }
    if (req.method === 'GET') {
      try {
        const { id } = req.query
        console.log(id)
        const foro = await Foro.findOne({ planId: id })

        return res.status(200).json(foro)
      } catch (error) {
        console.error('Error finding foro:', error)

        return res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  } catch (error) {
    res.status(404).json({ status: 'No se puedieron cargar las solicitudes.' })
  }
}
