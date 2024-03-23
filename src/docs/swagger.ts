import swaggerAutogen from 'swagger-autogen'
import dotenv from 'dotenv'
import { getAppVersion } from '../utils/Utils'
dotenv.config()

const { SV_PORT, PROD_ENDPOINT } = process.env

const doc = {
  info: {
      version: `v${getAppVersion()}`,
      title: 'Authentication System API',
      description: 'Simple REST API where users may register themselves, authenticate and manage their accounts.'
  },
  servers: [
    {
        url: `http://localhost:${SV_PORT}`,
        description: 'Development server'
    },
    {
        url: PROD_ENDPOINT,
        description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Account',
      description: 'Account-related routes'
    },
    {
      name: 'User',
      description: 'Authenticated user-related routes'
    },
    {
      name: 'Admin',
      description: 'Administrator-related routes'
    },
    {
      name: 'API Info',
      description: 'Routes for health-checking and basic API info'
    }
  ],
  components: {
      securitySchemes: {
          bearerAuth: {
              type: 'http',
              scheme: 'bearer'
          }
      },
      requests: {
        RegisterAccount: {
          type: 'object',
          properties: {
            email: {
              type: 'string'
            },
            password: {
              type: 'string'
            }
          }
        }
      },
      responses: {
        SimpleResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'number'
            },
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'number'
            },
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string'
                },
                details: {
                  type: 'string'
                }
              }
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'number'
            },
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      examples: {
        RegisterAccount: {
          email: 'example@example.com',
          password: 'foobar123'
        }
      }
  }
}

const outputFile = './swagger_output.json'
const endpointsFiles = [
  '../routers/AccountRouter.ts',
  '../routers/AdminRouter.ts',
  '../routers/ApiInfoRouter.ts',
  '../routers/UserRouter.ts'
]

swaggerAutogen({
  openapi: '3.0.0'
})(outputFile, endpointsFiles, doc)