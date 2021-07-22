import { Prisma, TeamType } from '@prisma/client'
import {
  MutationResolvers,
  Team_Type,
  Role_Type,
  QueryResolvers,
  Resolvers,
  Resolver
} from '../../generated/schema'
import { toSlug } from '../../utils'
import { Context } from '../types'

import { roleFilter } from './utils'

export const TeamNameAvailability: Resolvers['TeamNameAvailability'] = {
  available: (parent) => parent.available
}

export const teamNameAvailable: QueryResolvers<Context>['teamNameAvailable'] =
  async (parent, args, context) => {
    let { teamName } = args
    return {
      available: !!(await context.prisma.team.findFirst({
        where: {
          slug: teamName
        }
      }))
    }
  }

const Team: Resolvers<Context>['Team'] = {
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
  },
  projects: async (parent, args, context) => {
    let { prisma } = context
    return prisma.project.findMany({
      where: {
        teamId: parent.id
      }
    })
  }
}

const createTeam: MutationResolvers<Context>['createTeam'] = async (
  parent,
  args,
  context
) => {
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
}

const deleteTeam: MutationResolvers<Context>['deleteTeam'] = async (
  parent,
  args,
  context
) => {
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

export { deleteTeam, createTeam, Team }
