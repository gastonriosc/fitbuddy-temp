// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      email: string
      phone: number
      role: string
      discipline: string
      gender: string
      country: string
    }
  }
}
