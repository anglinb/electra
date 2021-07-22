import { Resolver, Resolvers, Role_Type } from '../../generated/schema'
import { RoleType } from '@prisma/client'
import { Context } from '../types'
import { roleFilter } from './utils'

export const viewer: Resolvers<Context>['Query']['viewer'] = async (
  parent,
  _args,
  ctx,
  info
) => {
  if (!ctx.user) {
    return null
  }
  return ctx.user
}

export const TeamUserRole: Resolvers<Context>['TeamUserRole'] = {
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
}

export const User: Resolvers<Context>['User'] = {
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
}
