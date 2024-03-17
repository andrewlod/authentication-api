import type { Request } from 'express'
import { daoUser } from '../database'
import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import type { AuthResponse } from '../auth/AuthTypes'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

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
