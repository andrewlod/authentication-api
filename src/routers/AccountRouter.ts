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
  */
)
   
router.post('/login', AccountValidation.ValidateAccountCreation, AccountController.login as RequestHandler  /**
* #swagger.tags = ['Account']
* #swagger.summary = 'Login'
* #swagger.description = 'Log into the system with existing credentials'
* #swagger.path = '/api/v1/account/login'
* #swagger.requestBody = {
     description: 'Success',
     content: { 
       'application/json': { 
         schema: { 
           $ref: "#/components/requests/RegisterAccount"
         },
         examples: {
           'Login': {
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
           $ref: "#/components/responses/LoginResponse" 
         },
         examples: {
           "Success": {
             value: {
               "status": 200,
               "message": "Authentication successful!",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "data": {
                "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidGltZXN0YW1wIjoiMjAyNC0wMy0yM1QxODoxMTowNi42ODRaIiwiaWF0IjoxNzExMjE3NDY2LCJleHAiOjE3MTEyMjEwNjZ9.-RBqmBE8M-EkQPgbRTbppiIcqJmeDXNAcx8cd3utNmQ"
               }
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
* #swagger.responses[401] = {
     description: 'Unauthorized',
     content: {
       'application/json': { 
         schema: { 
           $ref: "#/components/responses/ErrorResponse" 
         },
         examples: {
           "Unauthorized": {
             value: {
               "status": 401,
               "message": "Authentication failed.",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "INVALID_CREDENTIALS",
                 "details": "An user with the provided email or password does not exist."
               }
             }
           },
         }
       }
     }
   }
*/
)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
