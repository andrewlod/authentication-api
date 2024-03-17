import type { Request } from 'express'
import type { AuthResponse } from '../auth/AuthTypes'
import { daoUser, type UserUpdateInput } from '../database'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

type AdminUserUpdateInput = Omit<UserUpdateInput, 'is_admin'> & {
  isAdmin?: boolean
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type AdminUserIdParams = {
  id: string
}

export async function adminUpdateUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse): Promise<void> {
  const id = parseInt(req.params.id)

  const {
    email: newEmail,
    password,
    isAdmin
  } = req.body

  const user = await daoUser.findById(id)

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found!'
    })
    return
  }

  const updateParams: UserUpdateInput = {}
  updateParams.email = newEmail
  updateParams.is_admin = isAdmin

  if (password !== undefined) {
    updateParams.password = await bcrypt.hash(password as string, PASSWORD_SALT)
  }

  await daoUser.update(user.id, updateParams)

  res.status(200).json({
    success: true
  })
}

export async function adminDeleteUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse): Promise<void> {
  const id = parseInt(req.params.id)

  const user = await daoUser.findById(id)

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found!'
    })
    return
  }

  await daoUser.delete(user.id)

  res.status(200).json({
    success: true
  })
}
