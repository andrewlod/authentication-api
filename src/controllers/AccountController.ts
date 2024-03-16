import type { Request, Response } from 'express'
import { daoUser } from '../database'
import type { RegularUserCreateInput } from '../database'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

export async function register (req: Request<any, any, RegularUserCreateInput>, res: Response): Promise<void> {
  const { email, password } = req.body

  const user = await daoUser.findByEmail(email)
  if (user !== null) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      reason: 'User already exists!'
    })
    return
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT)

  await daoUser.create({
    email,
    password: passwordHash,
    is_admin: false
  })

  res.status(StatusCodes.OK).json({
    success: true
  })
}
