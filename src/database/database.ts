import { PrismaClient } from './schemas/generated/prisma-client.js'
import { DaoUser, DaoUserToken } from './daos'
import { SecretManager } from '../secrets'

const DATABASE_URL = SecretManager.getSecret('DATABASE_URL')

export const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL
})
export const daoUser = new DaoUser(prisma)
export const daoUserToken = new DaoUserToken(prisma)

export type * as Types from './daos'
