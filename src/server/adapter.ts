import { PrismaClient, Team, TeamType, RoleType } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Providers from 'next-auth/providers'
import { toSlug } from '../utils'
const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle

export const getStaticOptions = () => {
  const staticOptions = {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_OAUTH_SECRET,
        profile(profile: any) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url
          }
        }
      })
    ],
    session: {
      jwt: false, // If no adapter specified, force use of JSON Web Tokens (stateless)
      maxAge,
      updateAge: 24 * 60 * 60 // Sessions updated only if session is greater than this value (0 = always, 24*60*60 = every 24 hours)
    },
    secret: process.env.NEXTAUTH_SECRET!
  }
  return staticOptions
}

// const CustomPrismaAdapter = PrismaAdapter
// const CustomPrismaAdapter =  (prisma: PrismaClient) => {
//   let originalAdpaterBuilder = PrismaAdapter(prisma);

//   return {
//     async getAdapter({ session, secret, ...appOptions }: { session: any, secret: string }) {
//       // @ts-ignore
//       let originalAdapter = await originalAdpaterBuilder.getAdapter({ session, secret, ...appOptions })

//       // const createUser = async (profile: any) => {
//       //   // Create a default team
//       //   let personalTeam = await prisma.team.create({
//       //     data:{
//       //       name: profile.name,
//       //       teamType: TeamType.PERSONAL,
//       //     }
//       //   })

//       //   let { id, ...restOfProfile } = profile;
//       //   return prisma.user.create({
//       //     data: {
//       //       name: profile.name,
//       //       email: profile.email,
//       //       image: profile.image,
//       //       emailVerified: profile.emailVerified?.toISOString() ?? null,
//       //       ...restOfProfile,
//       //       personalTeamId: personalTeam.id,
//       //     },
//       //   })
//       // };
// 			const  getUserByProviderAccountId = async (providerId: string, providerAccountId: string)  => {

// 			}

//       let returning = {
//         ...originalAdapter,
// 				getUserByProviderAccountId,
//       };
//       return returning
//     }
//   }
// }

export const buildAdapter = async (prisma: PrismaClient) => {
  return CustomPrismaAdapter(prisma).getAdapter(getStaticOptions())
}

// const CustomPrismaAdapter = PrismaAdapter
const CustomPrismaAdapter = (prisma: PrismaClient) => {
  let originalAdpaterBuilder = PrismaAdapter(prisma)

  return {
    async getAdapter({
      session,
      secret,
      ...appOptions
    }: {
      session?: any
      secret: string
    }) {
      // @ts-ignore
      let originalAdapter = await originalAdpaterBuilder.getAdapter({
        session,
        secret,
        ...appOptions
      })
      const createUser = async (profile: any) => {
        // Create a default team
        let personalTeam: Team | undefined
        const options = [
          toSlug(profile),
          `${toSlug}-${((Math.random() * 0xffffff) << 0)
            .toString(16)
            .padStart(6, '0')}`
        ]
        for (let i = 0; i < options.length; i++) {
          personalTeam = await prisma.team.create({
            data: {
              slug: options[i],
              name: profile.name,
              teamType: TeamType.PERSONAL,
              image: profile.image
            }
          })
          if (personalTeam) {
            break
          }
        }
        if (!personalTeam) {
          throw new Error('Unable to create personal team for user')
        }

        let { id, ...restOfProfile } = profile
        return prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            image: profile.image,
            emailVerified: profile.emailVerified?.toISOString() ?? null,
            ...restOfProfile,
            roles: {
              create: [
                {
                  teamId: personalTeam.id,
                  role: RoleType.OWNER
                }
              ]
            }
          }
        })
      }

      //  const getSession = async (sessionToken: string) => {
      //     if (!sessionToken) {
      //       return null;
      //     };
      //     const session = await prisma.session.findUnique({
      //         where: { sessionToken },
      //     });
      //     if (session && session.expires < new Date()) {
      //         await prisma.session.delete({ where: { sessionToken } });
      //         return null;
      //     }
      //     return session;
      // 	}

      let returning = {
        ...originalAdapter,
        createUser
        // getSession
      }
      return returning
    }
  }
}

export default CustomPrismaAdapter
