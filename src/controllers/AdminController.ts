import type { Request, Response } from 'express'
import type { AuthResponse } from '../auth/AuthTypes'
import { daoUser, type UserType, type UserUpdateInput } from '../database'
import { SecretManager } from '../secrets'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import { sendDataResponse, sendResponse } from './ResponseFactory'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

type AdminUserUpdateInput = Omit<UserUpdateInput, 'is_admin'> & {
  isAdmin?: boolean
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type AdminUserIdParams = {
  id: string
}

export async function getAllUsers (_req: Request, res: Response): Promise<void> {
  let users: UserType[]
  try {
    users = await daoUser.findMany({
      select: {
        id: true,
        email: true,
        is_admin: true
      }
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: 'Could not fetch all users!'
    })
    return
  }

  sendDataResponse(res, {
    status: StatusCodes.OK,
    message: 'Users successfully fetched.',
    data: {
      users
    }
  })
}

export async function getUser (req: Request<AdminUserIdParams, any, any>, res: Response): Promise<void> {
  const id = parseInt(req.params.id)

  let user: UserType | null
  try {
    user = await daoUser.findById(id, {
      id: true,
      email: true,
      is_admin: true
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: 'Could not fetch all users!'
    })
    return
  }

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found!'
    })
    return
  }

  sendDataResponse(res, {
    status: StatusCodes.OK,
    message: 'User successfully fetched.',
    data: {
      user
    }
  })
}

export async function adminUpdateUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse): Promise<void> {
  const id = parseInt(req.params.id)

  const {
    email: newEmail,
    password,
    isAdmin
  } = req.body

  const user = await daoUser.findById(id)

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found!'
    })
    return
  }

  const updateParams: UserUpdateInput = {}
  updateParams.email = newEmail
  updateParams.is_admin = isAdmin

  if (password !== undefined) {
    updateParams.password = await bcrypt.hash(password as string, PASSWORD_SALT)
  }

  await daoUser.update(user.id, updateParams)

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'User successfully updated.'
  })
}

export async function adminDeleteUser (req: Request<AdminUserIdParams, any, AdminUserUpdateInput>, res: AuthResponse): Promise<void> {
  const id = parseInt(req.params.id)

  const user = await daoUser.findById(id)

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      reason: 'User not found!'
    })
    return
  }

  await daoUser.delete(user.id)

  sendResponse(res, {
    status: StatusCodes.OK,
    message: 'User successfully deleted.'
  })
}
