// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import PlanModel from 'src/models/planSchema'
import mongoose from 'mongoose'
import StudentInsights from 'src/models/studentInsights'
import User from 'src/models/userSchema'

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
      const userPeso = await User.findById(id, 'weight')
      const dataPeso = await StudentInsights.aggregate([
        { $match: { studentId: objectId } },
        { $unwind: '$data' },
        { $match: { 'data.deleted': false } },
        { $group: { _id: '$_id', data: { $push: '$data' } } }
      ])

      console.log(dataPeso)

      if (dataTracking && dataPeso.length > 0) {
        const combinedDates = dataTracking.reduce((acc, curr) => acc.concat(curr.dataTracking), [])

        const responseData = {
          dataTracking: combinedDates,
          dataPeso: dataPeso[0],
          userPeso: userPeso
        }

        return res.status(200).json(responseData)
      } else {
        return res.status(404).json({ message: 'No se encontro el usuario' })
      }
    } catch (error) {
      console.error('Error finding user:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else if (req.method === 'PUT') {
    const { id, data } = req.body
    const existingRecord = await StudentInsights.findOne({
      studentId: id,
      'data._id': data.id
    })

    if (existingRecord) {
      // Si existe, actualizar el documento
      const updatedTracking = await StudentInsights.findOneAndUpdate(
        {
          studentId: id,
          'data._id': data.id
        },
        {
          $set: {
            'data.$.date': data.date,
            'data.$.weight': data.weight,
            'data.$.deleted': data.deleted
          }
        },
        { new: true }
      )

      if (updatedTracking) {
        const filteredData = updatedTracking.data.filter(item => !item.deleted)
        updatedTracking.data = filteredData

        return res.status(200).json(updatedTracking)
      } else {
        return res.status(404).json({ error: 'No se pudo actualizar el registro' })
      }
    } else {
      const updatedTracking = await StudentInsights.findOneAndUpdate(
        { studentId: id },
        { $push: { data: { $each: [data] } } },
        { new: true, upsert: true }
      )
      if (updatedTracking) {
        const filteredData = updatedTracking.data.filter(item => !item.deleted)
        updatedTracking.data = filteredData

        return res.status(200).json(updatedTracking)
      } else {
        return res.status(404).json({ error: 'No se pudo actualizar el registro' })
      }
    }
  } else {
    return res.status(500).json({ message: 'Método no permitido.' })
  }
}

export default handler
