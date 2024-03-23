import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AdminController } from '../controllers'
import { DatabaseMiddlewares, RouteMiddlewares } from '../middlewares'
import { AdminValidation } from '../validation'

const router = Router()

router.get('/users', AdminController.getAllUsers as RequestHandler
/**
 * #swagger.tags = ['Admin']
 * #swagger.summary = 'Get all users'
 * #swagger.description = 'Finds all users registered in the database and returns to the administrator.'
 * #swagger.path = '/api/v1/admin/users'
 * #swagger.security = [{ "BearerAuth": [] }]
  * #swagger.responses[200] = {
      description: 'Success',
      content: {
        'application/json': {
          schema: { 
            $ref: "#/components/responses/GetAllUsersResponse" 
          },
          examples: {
            "Success": {
              value: {
                "status": 200,
                "message": "Users successfully fetched.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "data": {
                  "users": [
                    {
                      "id": 1,
                      "email": "example@example.com",
                      "is_admin": false
                    }
                  ]
                }
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
  */
 )
router.get('/users/:id', AdminValidation.ValidateAdminUserGet, AdminController.getUser as RequestHandler
/**
 * #swagger.tags = ['Admin']
 * #swagger.summary = 'Get user by ID'
 * #swagger.description = 'Finds an user by their ID.'
 * #swagger.path = '/api/v1/admin/users/{id}'
 * #swagger.security = [{ "BearerAuth": [] }]
  * #swagger.responses[200] = {
      description: 'Success',
      content: {
        'application/json': {
          schema: { 
            $ref: "#/components/responses/GetUserByIdResponse" 
          },
          examples: {
            "Success": {
              value: {
                "status": 200,
                "message": "User successfully fetched.",
                "timestamp": "2024-03-23T17:46:20.968Z",
                "data": {
                  "user": {
                    "id": 1,
                    "email": "example@example.com",
                    "is_admin": false
                  }
                }
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
* #swagger.responses[404] = {
     description: 'Not Found',
     content: {
       'application/json': { 
         schema: { 
           $ref: "#/components/responses/ErrorResponse" 
         },
         examples: {
           "Bad Request": {
             value: {
               "status": 400,
               "message": "User not found.",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "USER_NOT_FOUND",
                 "details": "User with ID 1 was not found in the database."
               }
             }
           },
         }
       }
     }
   }
  */
 )

router.put('/users/:id', AdminValidation.ValidateAdminUserUpdate, DatabaseMiddlewares.checkEmailExists('email'), AdminController.adminUpdateUser as RequestHandler
/**
 * #swagger.tags = ['Admin']
 * #swagger.summary = 'Modify user by ID'
 * #swagger.description = 'Modify an user given their ID.'
 * #swagger.path = '/api/v1/admin/users/{id}'
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
                "message": "User successfully fetched.",
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
* #swagger.responses[404] = {
     description: 'Not Found',
     content: {
       'application/json': { 
         schema: { 
           $ref: "#/components/responses/ErrorResponse" 
         },
         examples: {
           "Bad Request": {
             value: {
               "status": 400,
               "message": "User not found.",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "USER_NOT_FOUND",
                 "details": "User with ID 1 was not found in the database."
               }
             }
           },
         }
       }
     }
   }
  */
 )

router.delete('/users/:id', AdminController.adminDeleteUser as RequestHandler
/**
 * #swagger.tags = ['Admin']
 * #swagger.summary = 'Delete user by ID'
 * #swagger.description = 'Deletes an user given their ID.'
 * #swagger.path = '/api/v1/admin/users/{id}'
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
                "message": "User successfully deleted.",
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
* #swagger.responses[404] = {
     description: 'Not Found',
     content: {
       'application/json': { 
         schema: { 
           $ref: "#/components/responses/ErrorResponse" 
         },
         examples: {
           "Bad Request": {
             value: {
               "status": 400,
               "message": "User not found",
               "timestamp": "2024-03-23T17:46:20.968Z",
               "error": {
                 "code": "USER_NOT_FOUND",
                 "details": "User with ID 1 has not been found."
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
