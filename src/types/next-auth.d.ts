// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      age: string
      weight: string
      height: string
      _id: number
      password: string
      name: string
      email: string
      phone: number
      role: string
      discipline: string
      gender: string
      country: string
      avatar: string
    }
  }
}
