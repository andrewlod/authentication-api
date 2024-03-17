import { body, param } from 'express-validator'
import { checkBodyHasAtLeastOne, checkValidationResult } from './ResultChecker'

export const ValidateAdminUserUpdate = [
  body('email').isEmail().isLength({
    min: 5,
    max: 255
  }).optional(),
  body('password').isString().isLength({
    min: 6,
    max: 32
  }).optional(),
  body('isAdmin').isBoolean().optional(),
  param('id').isInt().optional(),
  checkBodyHasAtLeastOne(['email', 'password', 'isAdmin']),
  checkValidationResult
]

export const ValidateAdminUserGet = [
  param('id').isInt().optional(),
  checkValidationResult
]
