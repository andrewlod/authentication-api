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
  components: {
      securitySchemes: {
          bearerAuth: {
              type: 'http',
              scheme: 'bearer'
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