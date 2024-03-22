import { PrismaClient } from './schemas/generated/prisma-client.js'
import { DaoUser, DaoUserToken } from './daos'

export const prisma = new PrismaClient()
export const daoUser = new DaoUser(prisma)
export const daoUserToken = new DaoUserToken(prisma)

export type * as Types from './daos'
