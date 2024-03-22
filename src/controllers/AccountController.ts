import type { NextFunction, Request, Response } from 'express'
import type { Types } from '../database'
import { daoUser, daoUserToken } from '../database'
import { StatusCodes } from 'http-status-codes'
import { SecretManager } from '../secrets'
import { CipherManager, JWTManager } from '../auth'
import { sendDataResponse, sendResponse } from './ResponseFactory'
import { ApplicationErrorConflict, ApplicationErrorUnauthorized } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))
const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

export async function register (req: Request<any, any, Types.RegularUserCreateInput>, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body

  try {
    const user = await daoUser.findByEmail(email)
    if (user !== null) {
      throw new ApplicationErrorConflict({
        code: ErrorConstants.USER_EXISTS,
        details: `User with email ${email} already exists.`
      }, 'User already exists!')
    }

    const passwordHash = await CipherManager.hash(password)

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

export async function login (req: Request<any, any, Types.RegularUserCreateInput>, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body

  try {
    const user = await daoUser.findByEmail(email)
    if (user === null) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.INVALID_CREDENTIALS,
        details: 'An user with the provided email or password does not exist.'
      }, 'Authentication failed.')
    }

    const passwordMatches = await CipherManager.compare(password, user.password)
    if (!passwordMatches) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.INVALID_CREDENTIALS,
        details: 'An user with the provided email or password does not exist.'
      }, 'Authentication failed.')
    }

    const token = JWTManager.sign({
      id: user.id,
      timestamp: new Date()
    })

    const now = new Date()

    await daoUserToken.create({
      token,
      expires_at: new Date(now.getTime() + 60000 * JWT_EXPIRE_MINUTES),
      user: {
        connect: {
          id: user.id
        }
      }
    })

    const bearerToken = `Bearer ${token}`

    res.cookie(JWT_COOKIE_KEY, bearerToken, {
      maxAge: 1000 * 60 * JWT_EXPIRE_MINUTES,
      httpOnly: true
    })

    sendDataResponse(res, {
      status: StatusCodes.OK,
      message: 'Authentication successful!',
      data: {
        token: bearerToken
      }
    })
  } catch (err) {
    next(err)
  }
}
