import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AccountValidation } from '../validation'
import { AccountController } from '../controllers'
import { RouteMiddlewares } from '../middlewares'

const router = Router()


router.post('/register', AccountValidation.ValidateAccountCreation, AccountController.register as RequestHandler

  /**
   * #swagger.tags = ['Account']
   * #swagger.summary = 'Register an account'
   * #swagger.description = 'Registers an account with email and password'
   * #swagger.path = '/api/v1/account/register'
   * #swagger.requestBody = {
        description: 'Success',
        content: { 
          'application/json': { 
            schema: { 
              $ref: "#/components/requests/RegisterAccount"
            },
            examples: {
              'Register account': {
                $ref: "#/components/examples/RegisterAccount"
              }
            }
          }
        }
      }
   * #swagger.responses[200] = {
        description: 'Success',
        content: {
          'application/json': { 
            schema: { 
              $ref: "#/components/responses/SimpleResponse" 
            },
            examples: {
              "Success": {
                value: {
                  "status": 200,
                  "message": "Registration successful!",
                  "timestamp": "2024-03-23T17:46:20.968Z"
                }
              },
            }
          }
        }
      }
   * #swagger.responses[400] = {
        description: 'Bad request',
        content: {
          'application/json': { 
            schema: { 
              $ref: "#/components/responses/ErrorResponse" 
            },
            examples: {
              "Bad Request": {
                value: {
                  "status": 400,
                  "message": "Validation failed.",
                  "timestamp": "2024-03-23T17:46:20.968Z",
                  "error": {
                    "code": "INVALID_BODY",
                    "details": "email"
                  }
                }
              },
            }
          }
        }
      }
   * #swagger.responses[409] = {
        description: 'Conflict',
        content: {
          'application/json': { 
            schema: { 
              $ref: "#/components/responses/ErrorResponse" 
            },
            examples: {
              "Conflict": {
                value: {
                  "status": 409,
                  "message": "User already exists!",
                  "timestamp": "2024-03-23T17:46:20.968Z",
                  "error": {
                    "code": "USER_EXISTS",
                    "details": "User with email example@example.com already exists."
                  }
                }
              },
            }
          }
        }
      }
   */)
   
router.post('/login', AccountValidation.ValidateAccountCreation, AccountController.login as RequestHandler)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
