import { Router } from 'express'
import type { RequestHandler } from 'express'
import { ApiInfoController } from '../controllers'

const router = Router()

router.post('/ping', ApiInfoController.ping as RequestHandler)
router.post('/version', ApiInfoController.version as RequestHandler)

export default router
