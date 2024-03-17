import type { Prisma, PrismaClient } from '../schemas/generated/prisma-client.js'

export type UserType = Prisma.UserGetPayload<Prisma.UserDefaultArgs>
export type RegularUserCreateInput = Omit<Prisma.UserCreateInput, 'is_admin'>
export type AnyUserCreateInput = Prisma.UserCreateInput
export type UserUpdateInput = Prisma.UserUpdateInput

export class DaoUser {
  user: Prisma.UserDelegate

  constructor (prisma: PrismaClient) {
    this.user = prisma.user
  }

  async findById (id: number, selectOptions: Prisma.UserSelect | undefined = undefined): Promise<UserType | null> {
    return await this.user.findUnique({
      where: {
        id
      },
      select: selectOptions
    })
  }

  async findByEmail (email: string): Promise<UserType | null> {
    return await this.user.findUnique({
      where: {
        email
      }
    })
  }

  async findMany (options: Prisma.UserFindManyArgs): Promise<UserType[]> {
    return await this.user.findMany(options)
  }

  async create (data: AnyUserCreateInput): Promise<UserType> {
    return await this.user.create({
      data
    })
  }

  async update (id: number, data: UserUpdateInput): Promise<UserType> {
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
