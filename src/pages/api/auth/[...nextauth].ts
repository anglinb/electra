import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import CustomPrismaAdapter from '../../../server/adapter'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile: any) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        }
      }
    })
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  adapter: CustomPrismaAdapter(prisma)
})
