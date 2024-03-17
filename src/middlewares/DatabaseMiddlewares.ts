import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { daoUser } from '../database'
import { StatusCodes } from 'http-status-codes'

export function checkEmailExists (emailKey: string): RequestHandler {
  type EmailCheckInput = {
    [emailKey in string]: string
  }

  return (async (req: Request<any, any, EmailCheckInput>, res: Response, next: NextFunction) => {
    const email = req.body[emailKey]
    if (email !== undefined) {
      if (await daoUser.findByEmail(email) !== null) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          reason: 'This email address is already being used!'
        })
        return
      }
    }

    next()
  }) as RequestHandler
}
