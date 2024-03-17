import type { NextFunction, Request, Response } from 'express'
import type { AuthResponse } from '../auth/AuthTypes'
import type { UserType } from '../database'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import { JWTManager } from '../auth'
import { daoUser } from '../database'
import { Logger } from '../logging'

const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

interface AuthorizationHeader {
  authorization?: string
}

type AuthorizationCookie = {
  [JWT_COOKIE_KEY in string]: string
}

export async function isAuthenticated (req: Request, res: Response, next: NextFunction): Promise<void> {
  let { authorization } = req.headers as AuthorizationHeader

  if (authorization === undefined) {
    const cookies = req.cookies as AuthorizationCookie
    authorization = cookies[JWT_COOKIE_KEY]
  }

  if (authorization === undefined) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Authorization header missing!'
    })
    return
  }

  if (!authorization.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Invalid token type!'
    })
    return
  }

  try {
    const decoded = JWTManager.verify(authorization.substring(7))
    res.locals.user = decoded
    res.locals.authenticated = true

    next()
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'Invalid token!'
    })
  }
}

export async function isAdmin (_req: Request, res: AuthResponse, next: NextFunction): Promise<void> {
  const { id } = res.locals.user

  let user: UserType | null
  try {
    user = await daoUser.findById(id)
  } catch (err) {
    Logger.error(`Failed to fetch user: ${err}`)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: 'Failed to fetch user!'
    })
    return
  }

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found.'
    })
    return
  }

  if (!user.is_admin) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      reason: 'User is not an admin!'
    })
    return
  }

  next()
}
