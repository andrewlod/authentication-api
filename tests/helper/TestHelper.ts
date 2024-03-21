import { expect } from "@jest/globals"
import { StatusCodes } from "http-status-codes"
import { ErrorConstants } from "../../src/errors"
import { Response } from "supertest"

export function expectInvalidBody(response: Response) {
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
  expect(response.body).toHaveProperty('error')
  expect(response.body.error).toHaveProperty('code')
  expect(response.body.error.code).toBe(ErrorConstants.INVALID_BODY)
}

export function expectExistingEmailError(response: Response) {
  expect(response.statusCode).toBe(StatusCodes.CONFLICT)
  expect(response.body).toHaveProperty('error')
  expect(response.body.error).toHaveProperty('code')
  expect(response.body.error.code).toBe(ErrorConstants.USER_EXISTS)
}

export function expectUserNotFoundError(response: Response) {
  expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
  expect(response.body).toHaveProperty('error')
  expect(response.body.error).toHaveProperty('code')
  expect(response.body.error.code).toBe(ErrorConstants.USER_NOT_FOUND)
}