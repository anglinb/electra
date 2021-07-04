import { prisma, Prisma, RoleType, TeamType } from '@prisma/client'
import {
  RequireFields,
  UserTeamsArgs,
  Resolvers,
  Role_Type,
  Team_Type
} from '../generated/schema'
import { toSlug } from '../utils'
import { Context } from './types'

const RoleTypeMap = {
  [RoleType.MEMBER]: Role_Type.Member,
  [RoleType.OWNER]: Role_Type.Owner
}

// const RoleTypeMap = {
//   [Role_Type.Member]: RoleType.MEMBER,
//   [Role_Type.Owner]: RoleType.OWNER,
// };

const roleFilter = (
  args: RequireFields<UserTeamsArgs, never>
): {
  role?: {
    in: Role_Type[]
  }
} => {
  let { roles } = args
  let rolesFilter = undefined
  if (roles && roles.length > 0) {
    rolesFilter = roles?.map((x) => RoleTypeMap[x])
  }
  return rolesFilter ? { role: { in: rolesFilter } } : {}
}

export const resolverVersion = 'test'
const resolvers: Resolvers<Context> = {
  Query: {
    viewer: async (parent, _args, ctx, info) => {
      if (!ctx.user) {
        return null
      }
      return ctx.user
    },
    drinkOfTheDay: () => {
      return 'Mojito'
    },
    teamNameAvailable: async (parent, args, context) => {
      let { teamName } = args
      return {
        available: !!(await context.prisma.team.findFirst({
          where: {
            slug: teamName
          }
        }))
      }
    }
  },
  // return context.prisma.team.findBy
  // },
  TeamNameAvailability: {
    available: (parent) => parent.available
  },
  User: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    image: (parent) => parent.image,
    teams: async (parent, args, context) => {
      console.log('query for roles here roles', parent.id)
      const query = {
        where: {
          userId: parent.id,
          ...roleFilter(args)
        },
        include: {
          team: true
        }
      }
      return context.prisma.teamUserRole
        .findMany(query)
        .then((roles) => roles.map((r) => r.team))
    },
    roles: async (parent, args, context) => {
      console.log('query for roles here roles')
      return context.prisma.teamUserRole.findMany({
        where: {
          userId: parent.id,
          ...roleFilter(args)
        }
      })
    }
  },
  TeamUserRole: {
    user: async (parent, _args, context) => {
      return (await context.prisma.user.findUnique({
        where: { id: parent.userId }
      }))!
    },
    team: async (parent, _args, context) => {
      return (await context.prisma.team.findUnique({
        where: { id: parent.teamId }
      }))!
    },
    role: (parent) => {
      switch (parent.role) {
        case RoleType.MEMBER:
          return Role_Type.Member
        case RoleType.OWNER:
          return Role_Type.Owner
      }
    }
  },
  Team: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    slug: (parent) => parent.slug,
    image: (parent) => parent.image,
    teamType: (parent) => {
      switch (parent.teamType) {
        case TeamType.PERSONAL:
          return Team_Type.Personal
        case TeamType.BUSINESS:
          return Team_Type.Business
      }
    },
    role: async (parent, args, context) => {
      if (!context.user) {
        return null
      }
      return context.prisma.teamUserRole.findFirst({
        where: {
          teamId: parent.id,
          userId: context.user.id
        }
      })
    },
    roles: async (parent, args, context) => {
      console.log('query for roles here roles')
      let roles = await context.prisma.teamUserRole.findMany({
        where: {
          teamId: parent.id,
          ...roleFilter(args)
        }
      })
      let userIsOwner = roles.find(
        (r) => r.userId === context.user?.id && r.role === Role_Type.Owner
      )
      if (userIsOwner) {
        return roles
      } else {
        return roles.filter((r) => r.userId === context.user?.id)
      }
    }
  },
  DeleteResult: {
    deleted: (parent) => parent.deleted
  },
  Mutation: {
    createTeam: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('must be authenticated')
      }

      let { teamName } = args.input || {}
      if (teamName) {
        try {
          let team = await context.prisma.team.create({
            data: {
              name: teamName,
              slug: toSlug(teamName),
              teamType: Team_Type.Business,
              users: {
                create: {
                  userId: context.user.id,
                  role: Role_Type.Owner
                }
              }
            }
          })
          return team
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
              throw new Error('Team name taken')
            }
          }
        }
      } else {
        throw new Error('No team name found')
      }
    },
    deleteTeam: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('must be authenticated')
      }
      let { teamId } = args.input || {}
      if (teamId) {
        let teamRole = await context.prisma.teamUserRole.findFirst({
          where: {
            teamId: teamId,
            userId: context.user.id,
            role: Role_Type.Owner,
            // Can only delete business teams
            team: {
              teamType: Team_Type.Business
            }
          },
          include: {
            team: true
          }
        })
        if (teamRole) {
          // Can't cascade so we have to clean up the teamUserRoles
          await context.prisma.teamUserRole.deleteMany({
            where: {
              teamId
            }
          })
          await context.prisma.team.delete({
            where: {
              id: teamId
            }
          })
          return {
            deleted: true
          }
        } else {
          throw new Error("Cant find team or you don't have permission")
        }
      } else {
        throw new Error('No team Id provided')
      }
    }
  }
}

export default resolvers
