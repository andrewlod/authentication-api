interface UserType {
  id: number
  email: string
  password: string
  is_admin: boolean
}

interface UserCreateType {
  id: number
  email: string
  password: string
  is_admin?: boolean
}

interface UserWritableType {
  email?: string
  password?: string
  is_admin?: boolean
}

export class DaoUserMock {
  data: Map<number, UserType>
  autoId: number

  constructor () {
    this.data = new Map<number, UserType>()  
    this.autoId = 1

    this.findById.bind(this)
    this.findByEmail.bind(this)
  }

  async findById (id: number, selectOptions: object | undefined = undefined): Promise<UserType | null> {
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

  async findByEmail (email: string): Promise<UserType | null> {
    for (let user of this.data.values()) {
      if (user.email === email) {
        return user
      }
    }

    return null
  }

  async findMany (_options: any): Promise<UserType[]> {
    return Array.from(this.data.values())
  }

  async create (data: Omit<UserCreateType, 'id'>): Promise<UserType> {
    const user: UserType = {
      id: this.autoId,
      email: data.email,
      password: data.password,
      is_admin: data.is_admin || false
    }

    this.data.set(this.autoId, user)
    this.autoId++

    return user
  }

  async update (id: number, data: UserWritableType): Promise<UserType | null> {
    const user = this.data.get(id)

    if (user === undefined) {
      return null
    }

    user.email = data.email || user.email
    user.password = data.password || user.password
    user.is_admin = data.is_admin || user.is_admin

    this.data.set(id, user)

    return user
  }

  async delete (id: number): Promise<UserType | null> {
    const user = this.data.get(id)

    if (user === undefined) {
      return null
    }

    this.data.delete(id)

    return user
  }

  clear () {
    this.data = new Map<number, UserType>()
    this.autoId = 1
  }
}