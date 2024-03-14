import { body } from 'express-validator'

export const ValidateAccountCreation = [
  body('email').isEmail().isLength({
    min: 5,
    max: 255
  }),
  body('username').isString().isLength({
    min: 3,
    max: 32
  }),
  body('password').isString().isLength({
    min: 6,
    max: 32
  })
]
