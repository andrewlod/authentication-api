import type { Request, Response } from 'express'
import { sendErrorResponse } from '../controllers/ResponseFactory'
import { StatusCodes } from 'http-status-codes'
import { ErrorConstants } from '../errors'

export async function routeNotFound (req: Request, res: Response): Promise<void> {
  sendErrorResponse(res, {
    status: StatusCodes.NOT_FOUND,
    message: 'Route not found.',
    error: {
      code: ErrorConstants.ROUTE_NOT_FOUND,
      details: `The route ${req.path} does not exist.`
    }
  })
}
