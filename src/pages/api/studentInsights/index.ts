// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import PlanModel from 'src/models/planSchema'
import mongoose from 'mongoose'
import StudentInsights from 'src/models/studentInsights'
import Insights from 'src/models/insight'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  // GET
  if (req.method === 'GET') {
    const { id } = req.query

    const objectId = new mongoose.Types.ObjectId(id)

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
      const dataPeso = await StudentInsights.find({ studentId: id })
      const dataObjectIdArray = dataPeso[0].data
      const documentosAsociados = await Insights.find({ _id: { $in: dataObjectIdArray } })

      if (documentosAsociados.length > 0) {
        documentosAsociados.forEach(doc => {
          if (doc.dataOfItem && doc.dataOfItem.length > 0) {
            const filteredData = doc.dataOfItem.filter((item: any) => !item.deleted)
            doc.dataOfItem = filteredData
          }
        })
      }

      if (dataTracking && documentosAsociados.length > 0) {
        const combinedDates = dataTracking.reduce((acc, curr) => acc.concat(curr.dataTracking), [])
        const responseData = {
          dataTracking: combinedDates,
          dataPeso: documentosAsociados
        }

        return res.status(200).json(responseData)
      } else {
        return res.status(404).json({ message: 'No se encontro el usuario' })
      }
    } catch (error) {
      console.error('Error finding user:', error)

      return res.status(500).json({ message: 'Internal Server Error' })
    }

    // PUT
  } else if (req.method === 'PUT') {
    const { isDelete, id, dataOfItem, studentId } = req.body

    if (isDelete) {
      await Insights.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            dataOfItem: { _id: dataOfItem._id }
          }
        },
        { new: true }
      )

      const dataPeso = await StudentInsights.find({ studentId: studentId })
      const dataObjectIdArray = dataPeso[0].data
      const documentosAsociados = await Insights.find({ _id: { $in: dataObjectIdArray } })

      if (documentosAsociados.length > 0) {
        documentosAsociados.forEach(doc => {
          if (doc.dataOfItem && doc.dataOfItem.length > 0) {
            const filteredData = doc.dataOfItem.filter((item: any) => !item.deleted)
            doc.dataOfItem = filteredData
          }
        })
      }

      if (documentosAsociados.length > 0) {
        return res.status(200).json(documentosAsociados)
      } else {
        return res.status(404).json({ message: 'No se encontro el usuario' })
      }
    } else {
      const postTracking = await Insights.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            dataOfItem: {
              $each: [
                {
                  date: dataOfItem.date,
                  weight: dataOfItem.weight,
                  deleted: dataOfItem.deleted
                }
              ]
            }
          }
        },
        { new: true, upsert: true }
      )

      if (postTracking) {
        const filteredData = postTracking.dataOfItem.filter((item: any) => !item.deleted)
        postTracking.dataOfItem = filteredData

        return res.status(200).json(postTracking)
      } else {
        return res.status(404).json({ error: 'No se pudo actualizar el registro' })
      }
    }
  } else if (req.method === 'POST') {
    const { id, data } = req.body

    const insight = await Insights.create({
      name: data.name,
      dataOfItem: {
        date: data.dataOfItem.date,
        weight: data.dataOfItem.weight,
        deleted: false
      }
    })

    const postTracking = await StudentInsights.findOneAndUpdate(
      { studentId: id },
      {
        $push: {
          data: insight._id
        }
      },
      { new: true, upsert: true }
    )
    const dataObjectIdArray = postTracking.data
    const documentosAsociados = await Insights.find({ _id: { $in: dataObjectIdArray } })

    if (documentosAsociados.length > 0) {
      documentosAsociados.forEach(doc => {
        if (doc.dataOfItem && doc.dataOfItem.length > 0) {
          const filteredData = doc.dataOfItem.filter((item: any) => !item.deleted)
          doc.dataOfItem = filteredData
        }
      })
    }

    if (documentosAsociados.length > 0) {
      return res.status(200).json(documentosAsociados[0])
    } else {
      return res.status(404).json({ error: 'No se pudo actualizar el registro' })
    }
  } else if (req.method === 'DELETE') {
    const { id, dataId } = req.body
    await Insights.findByIdAndDelete({ _id: dataId })
    const deleteInsight = await StudentInsights.findOneAndUpdate(
      { studentId: id },
      {
        $pull: {
          data: dataId
        }
      },
      { new: true }
    )
    const dataObjectIdArrayDeleted = deleteInsight.data
    const documentosAsociadosD = await Insights.find({ _id: { $in: dataObjectIdArrayDeleted } })

    if (documentosAsociadosD.length > 0) {
      documentosAsociadosD.forEach(doc => {
        if (doc.dataOfItem && doc.dataOfItem.length > 0) {
          const filteredData = doc.dataOfItem.filter((item: any) => !item.deleted)
          doc.dataOfItem = filteredData
        }
      })
    }
    if (documentosAsociadosD.length > 0) {
      return res.status(200).json(documentosAsociadosD[0])
    } else {
      return res.status(404).json({ error: 'No se pudo actualizar el registro' })
    }
  } else {
    return res.status(500).json({ message: 'Método no permitido.' })
  }
}

export default handler
