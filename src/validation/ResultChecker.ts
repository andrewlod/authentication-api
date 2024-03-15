import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

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
