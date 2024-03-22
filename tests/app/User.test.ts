import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { DaoUserMock, DaoUserTokenMock } from '../mocks'

let daoUserMock = new DaoUserMock()
let daoUserTokenMock = new DaoUserTokenMock()
jest.mock('../../src/database', () => {
  return {
    daoUser: daoUserMock,
    daoUserToken: daoUserTokenMock
  }
})

import { MainApp } from "../../src/apps"
import { ErrorConstants } from '../../src/errors'
import { CipherManager } from '../../src/auth'
import { expectExistingEmailError, expectInvalidBody } from '../helper/TestHelper'

describe('User Controller [V1]', () => {
  const USER_EMAIL = 'example@example.com'
  const USER_PASSWORD = 'foobar123'
  let USER_TOKEN: string

  beforeEach(async () => {
    await daoUserMock.create({
      email: USER_EMAIL,
      password: await CipherManager.hash(USER_PASSWORD),
      is_admin: false
    })

    const response = await  request(MainApp)
    .post('/api/v1/account/login')
    .send({
      email: USER_EMAIL,
      password: USER_PASSWORD
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

    USER_TOKEN = response.body.data.token
  })

  afterEach(() => {
    daoUserMock.clear()
  })

  test('No token', async () => {
    const response = await request(MainApp)
      .delete('/api/v1/users')
      .send()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toHaveProperty('code')
    expect(response.body.error.code).toBe(ErrorConstants.MISSING_AUTHORIZATION)
  })

  test('Update User - Success', async () => {
    const newPassword = 'barfoo321'

    const response = await request(MainApp)
      .put('/api/v1/users')
      .send({
        password: newPassword
      })
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Your user has been successfully updated!')

    const registeredUser = await daoUserMock.findById(1)
    expect(registeredUser?.email).toBe(USER_EMAIL)
    expect(await CipherManager.compare(newPassword, registeredUser?.password as string)).toBe(true)
    expect(registeredUser?.is_admin).toBe(false)
  })

  test('Update User - Invalid email', async () => {
    const newEmail = 'anInvalidEmail'

    const response = await request(MainApp)
      .put('/api/v1/users')
      .send({
        email: newEmail
      })
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expectInvalidBody(response)
  })

  test('Update User - Existing email', async () => {
    const response = await request(MainApp)
      .put('/api/v1/users')
      .send({
        email: USER_EMAIL
      })
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expectExistingEmailError(response)
  })

  test('Update User - Invalid password', async () => {
    const newPassword = 'foo'

    const response = await request(MainApp)
      .put('/api/v1/users')
      .send({
        password: newPassword
      })
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expectInvalidBody(response)
  })

  test('Delete User - Success', async () => {
    const response = await request(MainApp)
      .delete('/api/v1/users')
      .send()
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Your user has been successfully deleted.')

    const registeredUser = await daoUserMock.findById(1)
    expect(registeredUser).toBe(null)
  })

  test('Logout - Success', async () => {
    const response = await request(MainApp)
      .get('/api/v1/users/logout')
      .send()
      .set('Authorization', USER_TOKEN)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('You have logged off.')

    const userToken = await daoUserTokenMock.findByToken(USER_TOKEN)
    expect(userToken).not.toBeNull()

    const now = new Date()
    expect(now.getTime()).toBeGreaterThanOrEqual(userToken?.expires_at.getTime() || Infinity)
  })
})