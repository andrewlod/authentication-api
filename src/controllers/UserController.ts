import type { NextFunction, Request } from 'express'
import { daoUser, daoUserToken } from '../database'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import type { AuthResponse } from '../auth/AuthTypes'
import { sendResponse } from './ResponseFactory'
import { CipherManager } from '../auth'
import { ApplicationErrorNotFound } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

const JWT_COOKIE_KEY = SecretManager.getSecret('JWT_COOKIE_KEY')

interface UserUpdateInput {
  email?: string
  password?: string
}

export async function updateUser (req: Request<any, any, UserUpdateInput>, res: AuthResponse, next: NextFunction): Promise<void> {
  const { email, password } = req.body
  const { id } = res.locals.user

  const updateParams: UserUpdateInput = {}
  if (email !== undefined) {
    updateParams.email = email
  }

  try {
    if (password !== undefined) {
      updateParams.password = await CipherManager.hash(password)
    }
    await daoUser.update(id, updateParams)

    sendResponse(res, {
      status: StatusCodes.OK,
      message: 'Your user has been successfully updated!'
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteUser (_req: Request, res: AuthResponse, next: NextFunction): Promise<void> {
  const { id } = res.locals.user

  try {
    await daoUser.delete(id)

    res.clearCookie(JWT_COOKIE_KEY)

    sendResponse(res, {
      status: StatusCodes.OK,
      message: 'Your user has been successfully deleted.'
    })
  } catch (err) {
    next(err)
  }
}

export async function logout (_req: Request, res: AuthResponse, next: NextFunction): Promise<void> {
  try {
    let userToken = await daoUserToken.findByToken(res.locals.token)

    if (userToken == null) {
      throw new ApplicationErrorNotFound({
        code: ErrorConstants.USER_NOT_FOUND,
        details: 'Your token has not been found!'
      }, 'Token not found.')
    }

    await daoUserToken.update(userToken.id, {
      expires_at: new Date()
    })

    res.clearCookie(JWT_COOKIE_KEY)

    sendResponse(res, {
      status: StatusCodes.OK,
      message: 'You have logged off.'
    })
  } catch (err) {
    next(err)
  }
}
