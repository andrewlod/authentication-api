import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { daoUser } from '../database'
import { ApplicationErrorConflict } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

export function checkEmailExists (emailKey: string): RequestHandler {
  type EmailCheckInput = {
    [emailKey in string]: string
  }

  return (async (req: Request<any, any, EmailCheckInput>, res: Response, next: NextFunction) => {
    const email = req.body[emailKey]
    if (email !== undefined) {
      if (await daoUser.findByEmail(email) !== null) {
        next(new ApplicationErrorConflict({
          code: ErrorConstants.USER_EXISTS,
          details: `Email address ${email} is already registered!`
        }, 'Email already registered.'))
        return
      }
    }

    next()
  }) as RequestHandler
}
