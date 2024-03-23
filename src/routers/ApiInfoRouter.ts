import { Router } from 'express'
import type { RequestHandler } from 'express'
import { ApiInfoController } from '../controllers'
import { RouteMiddlewares } from '../middlewares'

const router = Router()

router.get('/ping', ApiInfoController.ping as RequestHandler
/**
 * #swagger.tags = ['API Info']
 * #swagger.summary = 'Ping'
 * #swagger.description = 'Returns "Pong!". Used for health-checking.'
 * #swagger.path = '/api/v1/api-info/ping'
  * #swagger.responses[200] = {
      description: 'Success',
      content: {
        'text/plain': {
          examples: {
            "Pong": {
              value: "Pong!"
            }
          }
        }
      }
    }
  */
)
router.get('/version', ApiInfoController.version as RequestHandler
/**
 * #swagger.tags = ['API Info']
 * #swagger.summary = 'Version'
 * #swagger.description = 'Gets the current API version.'
 * #swagger.path = '/api/v1/api-info/version'
  * #swagger.responses[200] = {
      description: 'Success',
      content: {
        'text/plain': {
          examples: {
            "Pong": {
              value: "Authentication API v0.0.1"
            }
          }
        }
      }
    }
  */
)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
