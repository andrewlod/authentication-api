import type { Request, Response } from 'express'
import { daoUser } from '../database'
import type { RegularUserCreateInput } from '../database'
import { StatusCodes } from 'http-status-codes'

class AccountController {
  async register (req: Request<any, any, RegularUserCreateInput>, res: Response): Promise<void> {
    const { email, password } = req.body

    const user = await daoUser.findByEmail(email)
    if (user !== null) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        reason: 'User already exists!'
      })
      return
    }

    await daoUser.create({
      email,
      password,
      is_admin: false
    })

    res.status(StatusCodes.OK).json({
      success: true
    })
  }
}

export default new AccountController()
