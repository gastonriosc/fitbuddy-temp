import connect from 'src/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import MyLibrary from 'src/models/myLibrary'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    const trainerId = req.query.id

    if (req.method === 'POST') {
      // Endpoint para agregar nuevos ejercicios a la librería
      const exerciseLibrary = await MyLibrary.create({ exercises: req.body.exercises, trainerId })
      if (exerciseLibrary) {
        return res.status(200).json(exerciseLibrary)
      } else {
        return res.status(404).json('No se pudo crear la libreria de ejercicios.')
      }
    } else if (req.method === 'PUT') {
      const existingLibrary = await MyLibrary.findOne({ trainerId })

      if (existingLibrary) {
        // Si ya existe la librería para el entrenador, agregar o modificar ejercicios
        existingLibrary.exercises = req.body.exercises
        await existingLibrary.save()

        return res.status(200).json(existingLibrary)
      } else {
        // Si no existe la librería, crearla con los nuevos ejercicios
        const exerciseLibrary = await MyLibrary.create({ exercises: req.body.exercises, trainerId })

        return res.status(200).json(exerciseLibrary)
      }
    } else if (req.method === 'GET') {
      const existingLibrary = await MyLibrary.findOne({ trainerId })

      if (existingLibrary) {
        return res.status(200).json(existingLibrary)
      } else {
        return res.status(404).json('No se encontró la libreria de ejercicios.')
      }
    } else if (req.method === 'DELETE') {
      const { exerciseName, linkExercise } = req.body
      const existingLibrary = await MyLibrary.findOne({ trainerId })

      if (existingLibrary) {
        // Eliminar ejercicio de la librería
        existingLibrary.exercises = existingLibrary.exercises.filter(
          exercise => exercise.exerciseName !== exerciseName || exercise.linkExercise !== linkExercise
        )
        await existingLibrary.save()

        return res.status(200).json(existingLibrary)
      } else {
        return res.status(404).json('No se encontró la libreria de ejercicios.')
      }
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (error) {
    console.error('Error:', error)

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
