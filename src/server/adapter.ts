import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

// async getUserByProviderAccountId(providerId, providerAccountId) {
// 		var _a;
// 		const account = await prisma.account.findUnique({
// 				where: {
// 						providerId_providerAccountId: { providerId, providerAccountId },
// 				},
// 				select: { user: true },
// 		});
// 		return (_a = account === null || account === void 0 ? void 0 : account.user) !== null && _a !== void 0 ? _a : null;
// },

const CustomPrismaAdapter = PrismaAdapter
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

export default CustomPrismaAdapter
