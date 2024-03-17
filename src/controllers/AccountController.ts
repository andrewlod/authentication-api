import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import type { RegularUserCreateInput } from '../database'
import { daoUser } from '../database'
import { StatusCodes } from 'http-status-codes'
import { SecretManager } from '../secrets'
import { JWTManager } from '../auth'

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

export async function login (req: Request<any, any, RegularUserCreateInput>, res: Response): Promise<void> {
  const { email, password } = req.body

  const user = await daoUser.findByEmail(email)
  if (user === null) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Authentication failed!'
    })
    return
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Authentication failed!'
    })
    return
  }

  const token = JWTManager.sign({
    id: user.id,
    email: user.email,
    isAdmin: user.is_admin,
    timestamp: new Date()
  })

  res.status(StatusCodes.OK).json({
    success: true,
    token
  })
}
