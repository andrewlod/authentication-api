import type { Response } from 'express'

export interface ApplicationResponse {
  status: number
  message: string
}

export interface DataApplicationResponse extends ApplicationResponse {
  data: object
}

export interface ApplicationError {
  code: string
  details: string
}

export interface ErrorApplicationResponse extends ApplicationResponse {
  error: ApplicationError
}

export function sendResponse (res: Response, options: ApplicationResponse): void {
  const now = new Date()
  res.status(options.status).json({
    ...options,
    timestamp: now.toISOString()
  })
}

export function sendDataResponse (res: Response, options: DataApplicationResponse): void {
  sendResponse(res, options)
}

export function sendErrorResponse (res: Response, options: ErrorApplicationResponse): void {
  sendResponse(res, options)
}
