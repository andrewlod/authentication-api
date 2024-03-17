import type { Request } from 'express'
import { daoUser } from '../database'
import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import type { AuthResponse } from '../auth/AuthTypes'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))
const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

interface UserUpdateInput {
  email?: string
  password?: string
}

export async function updateUser (req: Request<any, any, UserUpdateInput>, res: AuthResponse): Promise<void> {
  const { email, password } = req.body
  const { id } = res.locals.user

  const updateParams: UserUpdateInput = {}
  if (email !== undefined) {
    if (await daoUser.findByEmail(email) !== null) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        reason: 'This email address is already being used!'
      })
      return
    }
    updateParams.email = email
  }

  if (password !== undefined) {
    updateParams.password = await bcrypt.hash(password, PASSWORD_SALT)
  }

  await daoUser.update(id, updateParams)
  res.status(StatusCodes.OK).json({
    success: true
  })
}

export async function deleteUser (_req: Request, res: AuthResponse): Promise<void> {
  const { id } = res.locals.user

  await daoUser.delete(id)
  res.status(StatusCodes.OK).json({
    success: true
  })
}

export async function logout (req: Request, res: AuthResponse): Promise<void> {
  res.status(200).clearCookie(JWT_COOKIE_KEY).json({
    success: true
  })
}