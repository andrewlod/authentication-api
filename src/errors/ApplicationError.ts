import { StatusCodes } from 'http-status-codes'
import type { ApplicationResponse, ErrorApplicationResponse, ErrorDetails } from '../controllers/ResponseFactory'

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

export class ApplicationErrorNotFound extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.NOT_FOUND,
      message
    })
  }
}

export class ApplicationErrorForbidden extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.FORBIDDEN,
      message
    })
  }
}

export class ApplicationErrorUnauthorized extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.UNAUTHORIZED,
      message
    })
  }
}

export class ApplicationErrorBadRequest extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.BAD_REQUEST,
      message
    })
  }
}

export class ApplicationErrorConflict extends ApplicationError {
  constructor (error: ErrorDetails, message: string) {
    super(error, {
      status: StatusCodes.CONFLICT,
      message
    })
  }
}
