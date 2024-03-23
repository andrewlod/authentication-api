import type { NextFunction, Request, Response } from 'express'
import type { AuthResponse } from '../auth/AuthTypes'
import { SecretManager } from '../secrets'
import { JWTManager } from '../auth'
import { daoUser, daoUserToken } from '../database'
import { ErrorConstants } from '../errors'
import { ApplicationErrorForbidden, ApplicationErrorNotFound, ApplicationErrorUnauthorized } from '../errors/ApplicationError'

const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

interface AuthorizationHeader {
  authorization?: string
}

type AuthorizationCookie = {
  [JWT_COOKIE_KEY in string]: string
}

export async function isAuthenticated (req: Request, res: Response, next: NextFunction): Promise<void> {
  let { authorization } = req.headers as AuthorizationHeader
  try {
    if (authorization === undefined) {
      const cookies = req.cookies as AuthorizationCookie
      authorization = cookies[JWT_COOKIE_KEY]
    }

    if (authorization === undefined) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.MISSING_AUTHORIZATION,
        details: 'An Authorization header containing the JWT token must be provided.'
      }, 'Missing Authorization header.')
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.INVALID_AUTHORIZATION_TYPE,
        details: 'The type of the provided JWT token is invalid. Format: Bearer <token>.'
      }, 'Invalid token type.')
    }

    let token = authorization.substring(7)
    const userToken = await daoUserToken.findByToken(token)

    if (userToken === null || userToken.expires_at < new Date()) {
      throw new ApplicationErrorUnauthorized({
        code: ErrorConstants.TOKEN_EXPIRED,
        details: 'Your token has expired. Please authenticate again to continue.'
      }, 'Token expired.')
    }

    const decoded = await JWTManager.verify(token)
    res.locals.user = decoded
    res.locals.authenticated = true
    res.locals.token = userToken.token


    next()
  } catch (err) {
    next(err)
  }
}

export async function isAdmin (_req: Request, res: AuthResponse, next: NextFunction): Promise<void> {
  const { id } = res.locals.user

  try {
    const user = await daoUser.findById(id)

    if (user === null) {
      throw new ApplicationErrorNotFound({
        code: ErrorConstants.USER_NOT_FOUND,
        details: 'User has not been found in the database.'
      }, 'User not found.')
    }

    if (!user.is_admin) {
      throw new ApplicationErrorForbidden({
        code: ErrorConstants.NOT_ENOUGH_PRIVILEGES,
        details: 'You must be an administrator to perform that action!'
      }, 'User not authorized.')
    }

    next()
  } catch (err) {
    next(err)
  }
}
