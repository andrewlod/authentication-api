import { body } from 'express-validator'
import { checkValidationResult } from './ResultChecker'

export const ValidateAccountCreation = [
  body('email').isEmail().isLength({
    min: 5,
    max: 255
  }),
  body('password').isString().isLength({
    min: 6,
    max: 32
  }),
  checkValidationResult
]
