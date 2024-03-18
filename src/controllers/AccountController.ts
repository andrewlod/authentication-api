import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import type { RegularUserCreateInput } from '../database'
import { daoUser } from '../database'
import { StatusCodes } from 'http-status-codes'
import { SecretManager } from '../secrets'
import { JWTManager } from '../auth'
import { sendDataResponse, sendResponse } from './ResponseFactory'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))
const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))
const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

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

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'Registration successful!'
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

  const token = 'Bearer ' + JWTManager.sign({
    id: user.id,
    timestamp: new Date()
  })

  res.cookie(JWT_COOKIE_KEY, token, {
    maxAge: 1000 * 60 * JWT_EXPIRE_MINUTES,
    httpOnly: true
  })

  sendDataResponse(res, {
    status: StatusCodes.OK,
    message: 'Authentication successful!',
    data: {
      token
    }
  })
}
