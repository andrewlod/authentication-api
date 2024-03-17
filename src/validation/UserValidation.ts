import { body } from 'express-validator'
import { checkBodyHasAtLeastOne, checkValidationResult } from './ResultChecker'

export const ValidateUserUpdate = [
  body('email').isEmail().isLength({
    min: 5,
    max: 255
  }).optional(),
  body('password').isString().isLength({
    min: 6,
    max: 32
  }).optional(),
  checkBodyHasAtLeastOne(['email', 'password']),
  checkValidationResult
]
