import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'
import { ApplicationErrorBadRequest } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

export function checkBodyHasAtLeastOne (keys: string[]): RequestHandler {
  return (async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body as object).some(key => keys.includes(key))) {
      next()
      return
    }

    next(new ApplicationErrorBadRequest({
      code: ErrorConstants.INVALID_BODY,
      details: `Validation failed: at least one of the following must be provided: ${keys.toString()}`
    }, 'Validation failed.'))
  }) as RequestHandler
}

export async function checkValidationResult (req: Request, res: Response, next: NextFunction): Promise<void> {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    next(new ApplicationErrorBadRequest({
      code: ErrorConstants.INVALID_BODY,
      details: result.array()[0].msg
    }, 'Validation failed.'))
    return
  }

  next()
}
