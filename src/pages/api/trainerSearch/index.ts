// ** Next Imports
import { NextApiRequest, NextApiResponse } from 'next/types'
import connect from 'src/lib/mongodb'
import User from 'src/models/userSchema'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connect()

  try {
    const trainers = await User.aggregate([
      {
        $match: {
          role: 'Entrenador'
        }
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'trainerId',
          as: 'subscription_info'
        }
      },
      {
        $unwind: '$subscription_info'
      },
      {
        $match: {
          'subscription_info.deleted': false
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          phone: { $first: '$phone' },
          role: { $first: '$role' },
          discipline: { $first: '$discipline' },
          gender: { $first: '$gender' },
          country: { $first: '$country' },
          avatar: { $first: '$avatar' },
          subscriptions: {
            $push: {
              _id: '$subscription_info._id',
              daysPerWeek: '$subscription_info.daysPerWeek',
              intensity: '$subscription_info.intensity',
              following: '$subscription_info.following'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          discipline: 1,
          gender: 1,
          country: 1,
          avatar: 1,
          subscriptions: 1
        }
      }
    ])
    if (trainers && trainers.length > 0) {
      console.log(trainers)

      return res.status(200).json(trainers)
    } else {
      return res.status(404).json({ message: 'No se encontraron usuarios' })
    }
  } catch (error) {
    console.error('Error finding users:', error)

    return res.status(500).json({ message: 'Error' })
  }
}

export default handler
