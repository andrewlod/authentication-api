import type { NextFunction, Request, Response } from 'express'
import { ApplicationError } from './ApplicationError'
import { Logger } from '../logging'
import { sendErrorResponse } from '../controllers/ResponseFactory'
import { StatusCodes } from 'http-status-codes'

export async function handleError (err: Error, _req: Request, res: Response, _next: NextFunction): Promise<void> {
  Logger.error(`${err.name} occurred: ${err.message}. Stack trace: ${err.stack}`)

  if (err instanceof ApplicationError) {
    sendErrorResponse(res, err.toResponse())
    return
  }

  sendErrorResponse(res, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unknown error',
    error: {
      code: 'UNKNOWN_ERROR',
      details: 'An unknown error has occurred.'
    }
  })
}
