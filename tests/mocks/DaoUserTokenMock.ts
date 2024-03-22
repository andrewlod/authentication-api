interface UserTokenType {
  id: number
  user_id: number
  token: string
  expires_at: Date
}

interface UserTokenCreateType {
  user_id: number
  token: string
  expires_at: Date
}

interface UserTokenWritableType {
  user_id?: number
  token?: string
  expires_at?: Date
}

export class DaoUserTokenMock {
  data: Map<number, UserTokenType>
  autoId: number

  constructor () {
    this.data = new Map<number, UserTokenType>()  
    this.autoId = 1
  }

  async findById (id: number, selectOptions: object | undefined = undefined): Promise<UserTokenType | null> {
    let user = this.data.get(id)
    if (user === undefined) {
      return null
    }

    if (selectOptions !== undefined) {
      let allowedKeys = Object.entries(selectOptions).filter(([k, v]) => v === true).map(([k, v]) => k)
      for (let key of Object.keys(user)) {
        if (!allowedKeys.includes(key)) {
          user[key] = undefined
        }
      }
    }

    return user
  }

  async findByToken (token: string): Promise<UserTokenType | null> {
    for (let userToken of this.data.values()) {
      if (userToken.token === token) {
        return userToken
      }
    }

    return null
  }

  async findMany (_options: any): Promise<UserTokenType[]> {
    return Array.from(this.data.values())
  }

  async create (data: UserTokenCreateType): Promise<UserTokenType> {
    const user: UserTokenType = {
      id: this.autoId,
      user_id: data.user_id,
      token: data.token,
      expires_at: data.expires_at
    }

    this.data.set(this.autoId, user)
    this.autoId++

    return user
  }

  async update (id: number, data: UserTokenWritableType): Promise<UserTokenType | null> {
    const user = this.data.get(id)

    if (user === undefined) {
      return null
    }

    user.user_id = data.user_id || user.user_id
    user.token = data.token || user.token
    user.expires_at = data.expires_at || user.expires_at

    this.data.set(id, user)

    return user
  }

  async delete (id: number): Promise<UserTokenType | null> {
    const user = this.data.get(id)

    if (user === undefined) {
      return null
    }

    this.data.delete(id)

    return user
  }

  clear () {
    this.data = new Map<number, UserTokenType>()
    this.autoId = 1
  }
}