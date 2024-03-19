import type { NextFunction, Request, Response } from 'express'
import type { AuthResponse } from '../auth/AuthTypes'
import { daoUser, type UserUpdateInput } from '../database'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import { sendDataResponse, sendResponse } from './ResponseFactory'
import { ApplicationErrorNotFound } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'
import { CipherManager } from '../auth'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

type AdminUserUpdateInput = Omit<UserUpdateInput, 'is_admin'> & {
  isAdmin?: boolean
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type AdminUserIdParams = {
  id: string
}

export async function getAllUsers (_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await daoUser.findMany({
      select: {
        id: true,
        email: true,
        is_admin: true
      }
    })

    sendDataResponse(res, {
      status: StatusCodes.OK,
      message: 'Users successfully fetched.',
      data: {
        users
      }
    })
  } catch (err) {
    next(err)
  }
}

export async function getUser (req: Request<AdminUserIdParams, any, any>, res: Response, next: NextFunction): Promise<void> {
  const id = parseInt(req.params.id)

  try {
    const user = await daoUser.findById(id, {
      id: true,
      email: true,
      is_admin: true
    })

    if (user === null) {
      throw new ApplicationErrorNotFound({
        code: ErrorConstants.USER_NOT_FOUND,
        details: `User with ID ${id} was not found in the database.`
      }, 'User not found.')
    }

    sendDataResponse(res, {
      status: StatusCodes.OK,
      message: 'User successfully fetched.',
      data: {
        user
      }
    })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id)

    const {
      email: newEmail,
      password,
      isAdmin
    } = req.body

    const user = await daoUser.findById(id)

    if (user === null) {
      throw new ApplicationErrorNotFound({
        code: ErrorConstants.USER_NOT_FOUND,
        details: `User with ID ${id} was not found in the database.`
      }, 'User not found.')
    }

    const updateParams: UserUpdateInput = {}
    updateParams.email = newEmail
    updateParams.is_admin = isAdmin

    if (password !== undefined) {
      updateParams.password = await CipherManager.hash(password as string)
    }

    await daoUser.update(user.id, updateParams)

    sendResponse(res, {
      status: StatusCodes.OK,
      message: 'User successfully updated.'
    })
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id)

    const user = await daoUser.findById(id)

    if (user === null) {
      throw new ApplicationErrorNotFound({
        code: ErrorConstants.USER_NOT_FOUND,
        details: `User with ID ${id} has not been found.`
      }, 'User not found')
    }

    await daoUser.delete(user.id)

    sendResponse(res, {
      status: StatusCodes.OK,
      message: 'User successfully deleted.'
    })
  } catch (err) {
    next(err)
  }
}
