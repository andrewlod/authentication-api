import { Router } from 'express'
import type { RequestHandler } from 'express'
import { ApiInfoController } from '../controllers'
import { RouteMiddlewares } from '../middlewares'

const router = Router()

router.get('/ping', ApiInfoController.ping as RequestHandler)
router.get('/version', ApiInfoController.version as RequestHandler)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
