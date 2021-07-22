import { MutationResolvers, Resolvers } from '../../generated/schema'
import { toSlug } from '../../utils'
import { Context } from '../types'

export const Project: Resolvers<Context>['Project'] = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  slug: (parent) => parent.slug,
  team: async (parent, _args, context) => {
    return (await context.prisma.team.findUnique({
      where: {
        id: parent.teamId
      }
    }))!
  }
}

export const deleteProject: MutationResolvers<Context>['deleteProject'] =
  async (parent, args, context) => {
    if (!context.user) {
      throw new Error('must be authenticated')
    }
    let { projectId } = args.input
    let project = context.prisma.project.findFirst({
      where: {
        id: projectId,
        team: {
          users: {
            some: {
              userId: context.user.id
            }
          }
        }
      }
    })
    if (!project) {
      throw new Error('Cant find project')
    }
    await context.prisma.project.delete({
      where: {
        id: projectId
      }
    })
    return {
      deleted: true
    }
  }

export const createProject: MutationResolvers<Context>['createProject'] =
  async (parent, args, context: Context) => {
    // Implictly checking that `(user, team, createProject)`
    if (!context.user) {
      throw new Error('must be authenticated')
    }
    const { prisma } = context

    let { teamId, projectName } = args.input
    let team = await prisma.team.findFirst({
      where: {
        id: teamId,
        users: {
          some: {
            userId: context.user.id
          }
        }
      }
    })
    if (!team) {
      throw new Error('Cannot find team')
    }
    let project = await prisma.project.create({
      data: {
        teamId,
        name: projectName,
        slug: toSlug(projectName)
      }
    })
    return project
  }
