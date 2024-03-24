import { StatusCodes } from 'http-status-codes'
import type { ApplicationResponse, ErrorApplicationResponse, ErrorDetails } from '../controllers/ResponseFactory'

/**
 * ApplicationError
 * 
 * Represents an error thrown when something has gone wrong while processing a request
 */
export class ApplicationError extends Error {
  response: ErrorApplicationResponse

  constructor (error: ErrorDetails, options: ApplicationResponse) {
    super(error.details)

    this.response = {
      status: options.status,
      message: options.message,
      error
    }
  }

  toResponse (): ErrorApplicationResponse {
    return this.response
  }
}

/**
 * ApplicationErrorNotFound
 * 
 * Application Error thrown when a resource has not been found in the database
 */
export class ApplicationErrorNotFound extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.NOT_FOUND,
      message
    })
  }
}

/**
 * ApplicationErrorForbidden
 * 
 * Application Error thrown when a user tries to access a resource without the necessary permissions
 */
export class ApplicationErrorForbidden extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.FORBIDDEN,
      message
    })
  }
}

/**
 * ApplicationErrorUnauthorized
 * 
 * Application Error thrown when a user tries to access a resource without being authenticated
 */
export class ApplicationErrorUnauthorized extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.UNAUTHORIZED,
      message
    })
  }
}

/**
 * ApplicationErrorBadRequest
 * 
 * Application Error thrown when a user sends an invalid request body
 */
export class ApplicationErrorBadRequest extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.BAD_REQUEST,
      message
    })
  }
}

/**
 * ApplicationErrorConflict
 * 
 * Application Error thrown when a request cannot be completed given the data sent by the user
 */
export class ApplicationErrorConflict extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.CONFLICT,
      message
    })
  }
}
