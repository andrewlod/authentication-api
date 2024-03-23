import { Router } from 'express'
import type { RequestHandler } from 'express'
import { UserController } from '../controllers'
import { UserValidation } from '../validation'
import { DatabaseMiddlewares, RouteMiddlewares } from '../middlewares'

const router = Router()

router.put('/', UserValidation.ValidateUserUpdate, DatabaseMiddlewares.checkEmailExists('email'), UserController.updateUser as RequestHandler
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Modify user'
 * #swagger.description = 'Modifies the logged in user'
 * #swagger.path = '/api/v1/users'
 * #swagger.security = [{ "BearerAuth": [] }]
 * #swagger.requestBody = {
      description: 'Success',
      content: { 
        'application/json': { 
          schema: { 
            $ref: "#/components/requests/UpdateUser"
          },
          examples: {
            'Modify User': {
              $ref: "#/components/examples/UpdateUser"
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
                "message": "Your user has been successfully updated!",
                "timestamp": "2024-03-23T17:46:20.968Z"
              }
            }
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
            "Unauthorized - No JWT Token": {
              value: {
                "status": 401,
                "message": "Missing Authorization header.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "MISSING_AUTHORIZATION",
                  "details": "An Authorization header containing the JWT token must be provided."
                }
              }
            },
            "Unauthorized - Invalid JWT Token Type": {
              value: {
                "status": 401,
                "message": "Invalid token type.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION_TYPE",
                  "details": "The type of the provided JWT token is invalid. Format: Bearer <token>."
                }
              }
            },
            "Unauthorized - Invalid JWT Token": {
              value: {
                "status": 401,
                "message": "Invalid token.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION",
                  "details": "The provided JWT token is invalid."
                }
              }
            },
            "Unauthorized - Expired JWT Token": {
              value: {
                "status": 401,
                "message": "Token expired.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "TOKEN_EXPIRED",
                  "details": "Your token has expired. Please authenticate again to continue."
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
               "message": "Email already registered.",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "USER_EXISTS",
                 "details": "Email address example@example.com is already registered!"
               }
             }
           }
         }
       }
     }
   }
  */
)

router.delete('/', UserController.deleteUser as RequestHandler
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Delete user'
 * #swagger.description = 'Deletes the logged in user'
 * #swagger.path = '/api/v1/users'
 * #swagger.security = [{ "BearerAuth": [] }]
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
                "message": "Your user has been successfully deleted.",
                "timestamp": "2024-03-23T17:46:20.968Z"
              }
            }
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
            "Unauthorized - No JWT Token": {
              value: {
                "status": 401,
                "message": "Missing Authorization header.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "MISSING_AUTHORIZATION",
                  "details": "An Authorization header containing the JWT token must be provided."
                }
              }
            },
            "Unauthorized - Invalid JWT Token Type": {
              value: {
                "status": 401,
                "message": "Invalid token type.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION_TYPE",
                  "details": "The type of the provided JWT token is invalid. Format: Bearer <token>."
                }
              }
            },
            "Unauthorized - Invalid JWT Token": {
              value: {
                "status": 401,
                "message": "Invalid token.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION",
                  "details": "The provided JWT token is invalid."
                }
              }
            },
            "Unauthorized - Expired JWT Token": {
              value: {
                "status": 401,
                "message": "Token expired.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "TOKEN_EXPIRED",
                  "details": "Your token has expired. Please authenticate again to continue."
                }
              }
            }
          }
        }
      }
    }
  */
)

router.get('/logout', UserController.logout as RequestHandler
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Logout'
 * #swagger.description = 'Logs out the current user by ending the JWT session.'
 * #swagger.path = '/api/v1/users/logout'
 * #swagger.security = [{ "BearerAuth": [] }]
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
                "message": "You have logged off.",
                "timestamp": "2024-03-23T17:46:20.968Z"
              }
            }
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
            "Unauthorized - No JWT Token": {
              value: {
                "status": 401,
                "message": "Missing Authorization header.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "MISSING_AUTHORIZATION",
                  "details": "An Authorization header containing the JWT token must be provided."
                }
              }
            },
            "Unauthorized - Invalid JWT Token Type": {
              value: {
                "status": 401,
                "message": "Invalid token type.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION_TYPE",
                  "details": "The type of the provided JWT token is invalid. Format: Bearer <token>."
                }
              }
            },
            "Unauthorized - Invalid JWT Token": {
              value: {
                "status": 401,
                "message": "Invalid token.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "INVALID_AUTHORIZATION",
                  "details": "The provided JWT token is invalid."
                }
              }
            },
            "Unauthorized - Expired JWT Token": {
              value: {
                "status": 401,
                "message": "Token expired.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "error": {
                  "code": "TOKEN_EXPIRED",
                  "details": "Your token has expired. Please authenticate again to continue."
                }
              }
            }
          }
        }
      }
    }
* #swagger.responses[404] = {
     description: 'Not Found',
     content: {
       'application/json': { 
         schema: { 
           $ref: "#/components/responses/ErrorResponse" 
         },
         examples: {
           "Not Found": {
             value: {
               "status": 404,
               "message": "Token not found.",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "USER_NOT_FOUND",
                 "details": "Your token has not been found!"
               }
             }
           }
         }
       }
     }
   }
  */
)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
