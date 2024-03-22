import type { Prisma, PrismaClient } from '../schemas/generated/prisma-client.js'

export type UserTokenType = Prisma.UserTokenGetPayload<Prisma.UserTokenDefaultArgs>
export type UserTokenCreateInput = Prisma.UserTokenCreateInput
export type UserTokenUpdateInput = Prisma.UserTokenUpdateInput

export class DaoUserToken {
  userToken: Prisma.UserTokenDelegate

  constructor (prisma: PrismaClient) {
    this.userToken = prisma.userToken
  }

  async findById (id: number, selectOptions: Prisma.UserSelect | undefined = undefined): Promise<UserTokenType | null> {
    return await this.userToken.findUnique({
      where: {
        id
      },
      select: selectOptions
    })
  }

  async findByToken (token: string): Promise<UserTokenType | null> {
    return await this.userToken.findFirst({
      where: {
        token
      },
      orderBy: {
        expires_at: 'desc'
      }
    })
  }

  async findMany (options: Prisma.UserTokenFindManyArgs): Promise<UserTokenType[]> {
    return await this.userToken.findMany(options)
  }

  async create (data: UserTokenCreateInput): Promise<UserTokenType> {
    return await this.userToken.create({
      data
    })
  }

  async update (id: number, data: UserTokenUpdateInput): Promise<UserTokenType | null> {
    return await this.userToken.update({
      where: {
        id
      },
      data
    })
  }

  async delete (id: number): Promise<UserTokenType | null> {
    return await this.userToken.delete({
      where: {
        id
      }
    })
  }
}
