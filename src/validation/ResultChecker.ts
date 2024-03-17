import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export function checkBodyHasAtLeastOne (keys: string[]): RequestHandler {
  return (async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body as object).some(key => keys.includes(key))) {
      next()
      return
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      reason: `Validation failed: at least one of the following must be provided: ${keys.toString()}`
    })
  }) as RequestHandler
}

export async function checkValidationResult (req: Request, res: Response, next: NextFunction): Promise<void> {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      reason: 'Validation failed',
      errors: result.mapped()
    })
    return
  }

  next()
}
