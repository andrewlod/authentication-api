import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import type { RegularUserCreateInput } from '../database'
import { daoUser } from '../database'
import { StatusCodes } from 'http-status-codes'
import { SecretManager } from '../secrets'
import { JWTManager } from '../auth'
import { sendDataResponse, sendResponse } from './ResponseFactory'
import { ApplicationErrorConflict, ApplicationErrorUnauthorized } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))
const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))
const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

export async function register (req: Request<any, any, RegularUserCreateInput>, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body

  try {
    const user = await daoUser.findByEmail(email)
    if (user !== null) {
      throw new ApplicationErrorConflict({
        code: ErrorConstants.USER_EXISTS,
        details: `User with email ${email} already exists.`
      }, 'User already exists!')
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
  } catch (err) {
    next(err)
  }
}

export async function login (req: Request<any, any, RegularUserCreateInput>, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body

  try {
    const user = await daoUser.findByEmail(email)
    if (user === null) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.INVALID_CREDENTIALS,
        details: 'An user with the provided email or password does not exist.'
      }, 'Authentication failed.')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.INVALID_CREDENTIALS,
        details: 'An user with the provided email or password does not exist.'
      }, 'Authentication failed.')
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
  } catch (err) {
    next(err)
  }
}
