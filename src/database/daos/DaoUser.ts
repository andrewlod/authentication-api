import type { Prisma, PrismaClient } from '../schemas/generated/prisma-client.js'

type UserType = Prisma.UserGetPayload<Prisma.UserDefaultArgs>

class DaoUser {
  user: Prisma.UserDelegate

  constructor (prisma: PrismaClient) {
    this.user = prisma.user
  }

  async findById (id: number): Promise<UserType | null> {
    return await this.user.findUnique({
      where: {
        id
      }
    })
  }

  async findMany (options: Prisma.UserFindManyArgs): Promise<UserType[]> {
    return await this.user.findMany(options)
  }

  async create (data: Prisma.UserCreateInput): Promise<UserType> {
    return await this.user.create({
      data
    })
  }

  async update (id: number, data: Prisma.UserUpdateInput): Promise<UserType> {
    return await this.user.update({
      where: {
        id
      },
      data
    })
  }

  async delete (id: number): Promise<UserType> {
    return await this.user.delete({
      where: {
        id
      }
    })
  }
}

export default DaoUser
