import { Resolvers } from '../../generated/schema'
import { Context } from '../types'

export const DeleteResult: Resolvers<Context>['DeleteResult'] = {
  deleted: (parent) => parent.deleted
}
