import { Resolvers } from '../../generated/schema'

import { Context } from '../types'

import { User, TeamUserRole, viewer } from './users'

import { Project, createProject, deleteProject } from './projects'

import {
  Team,
  TeamNameAvailability,
  teamNameAvailable,
  createTeam,
  deleteTeam
} from './teams'

import { DeleteResult } from './misc'

export const resolverVersion = 'test'
const resolvers: Resolvers<Context> = {
  Query: {
    viewer,
    teamNameAvailable,
    drinkOfTheDay: () => {
      return 'Mojito'
    }
  },
  User,
  Team,
  TeamUserRole,
  TeamNameAvailability,
  Project,
  DeleteResult,
  Mutation: {
    createProject,
    deleteProject,
    createTeam,
    deleteTeam
  }
}

export default resolvers
