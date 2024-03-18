import type { Request } from 'express'
import { daoUser } from '../database'
import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import type { AuthResponse } from '../auth/AuthTypes'
import { sendResponse } from './ResponseFactory'

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
    updateParams.email = email
  }

  if (password !== undefined) {
    updateParams.password = await bcrypt.hash(password, PASSWORD_SALT)
  }

  await daoUser.update(id, updateParams)

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'Your user has been successfully updated!'
  })
}

export async function deleteUser (_req: Request, res: AuthResponse): Promise<void> {
  const { id } = res.locals.user

  await daoUser.delete(id)

  res.clearCookie(JWT_COOKIE_KEY)

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'Your user has been successfully deleted.'
  })
}

export async function logout (req: Request, res: AuthResponse): Promise<void> {
  res.clearCookie(JWT_COOKIE_KEY)

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'You have logged off.'
  })
}
