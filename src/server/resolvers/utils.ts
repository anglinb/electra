import { RoleType } from '@prisma/client'

import { Role_Type, UserTeamsArgs, RequireFields } from '../../generated/schema'

export const RoleTypeMap = {
  [RoleType.MEMBER]: Role_Type.Member,
  [RoleType.OWNER]: Role_Type.Owner
}

export const roleFilter = (
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
