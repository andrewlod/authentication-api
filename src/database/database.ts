import { PrismaClient } from './schemas/generated/prisma-client.js'
import { DaoUser } from './daos'

export const prisma = new PrismaClient()
export const daoUser = new DaoUser(prisma)

export type { UserType, RegularUserCreateInput, AnyUserCreateInput, UserUpdateInput } from './daos'
