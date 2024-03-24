import type { Response } from 'express'

export interface ApplicationResponse {
  status: number
  message: string
}

export interface DataApplicationResponse extends ApplicationResponse {
  data: object
}

export interface ErrorDetails {
  code: string
  details: string
}

export interface ErrorApplicationResponse extends ApplicationResponse {
  error: ErrorDetails
}

/**
 * Sends a generic response, with status, message, timestamp and extra keys, if provided
 * 
 * @param {Response} res - Express.js Response object
 * @param {ApplicationResponse} options - Response data
 */
export function sendResponse (res: Response, options: ApplicationResponse): void {
  const now = new Date()
  res.status(options.status).json({
    ...options,
    timestamp: now.toISOString()
  })
}

/**
 * Sends a response containing any kind of data
 * 
 * @param {Response} res - Express.js Response object
 * @param {DataApplicationResponse} options - Response containing status, message, timestamp and data object
 */
export function sendDataResponse (res: Response, options: DataApplicationResponse): void {
  sendResponse(res, options)
}

/**
 * Sends an error response
 * 
 * @param {Response} res - Express.js Response object
 * @param {ErrorApplicationResponse} options - Response containing status, message, timestamp and error details
 */
export function sendErrorResponse (res: Response, options: ErrorApplicationResponse): void {
  sendResponse(res, options)
}
