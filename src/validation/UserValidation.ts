import { body } from 'express-validator'
import { checkValidationResult } from './ResultChecker'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

async function checkBodyNotEmpty (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body

  if (email === undefined && password === undefined) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      reason: 'Validation failed: at least one of the following must be provided: "email", "password"'
    })
    return
  }

  next()
}

export const ValidateUserUpdate = [
  body('email').isEmail().isLength({
    min: 5,
    max: 255
  }).optional(),
  body('password').isString().isLength({
    min: 6,
    max: 32
  }).optional(),
  checkBodyNotEmpty,
  checkValidationResult
]
