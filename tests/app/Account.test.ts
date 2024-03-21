import { afterEach, describe, expect, jest, test } from '@jest/globals'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { DaoUserMock } from '../mocks/DaoUserMock'

let daoUserMock = new DaoUserMock()
jest.mock('../../src/database', () => {
  return {
    daoUser: daoUserMock
  }
})

import { MainApp } from "../../src/apps"
import { CipherManager } from '../../src/auth'
import { ErrorConstants } from '../../src/errors'
import { expectInvalidBody } from '../helper/TestHelper'

describe('Account Controller [V1]', () => {
  afterEach(() => {
    daoUserMock.clear()
  })

  test('Register User - Success', async () => {
    const email = 'example@example.com'
    const password = 'foobar123'

    const response = await request(MainApp)
      .post('/api/v1/account/register')
      .send({
        email,
        password
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Registration successful!')

    const registeredUser = await daoUserMock.findById(1)
    expect(registeredUser?.email).toBe(email)
    expect(await CipherManager.compare(password, registeredUser?.password as string)).toBe(true)
    expect(registeredUser?.is_admin).toBe(false)
  })

  test('Register User - Not an email', async () => {
    const email = 'foo123'
    const password = 'foobar123'

    const response = await request(MainApp)
      .post('/api/v1/account/register')
      .send({
        email,
        password
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expectInvalidBody(response)
  })

  test('Register User - Password too short', async () => {
    const email = 'example@example.com'
    const password = 'fooba'

    const response = await request(MainApp)
      .post('/api/v1/account/register')
      .send({
        email,
        password
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expectInvalidBody(response)
  })

  test('Login - Success', async () => {
    const email = 'example@example.com'
    const password = 'foobar123'

    await daoUserMock.create({
      email,
      password: await CipherManager.hash(password),
      is_admin: false
    })

    const response = await request(MainApp)
      .post('/api/v1/account/login')
      .send({
        email,
        password
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('token')
    expect(response.body.message).toBe('Authentication successful!')
  })

  test('Login - Wrong email', async () => {
    const email = 'example@example.com'
    const password = 'foobar123'

    await daoUserMock.create({
      email,
      password: await CipherManager.hash(password),
      is_admin: false
    })

    const response = await request(MainApp)
      .post('/api/v1/account/login')
      .send({
        email: 'example1@example.com',
        password
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toHaveProperty('code')
    expect(response.body.error.code).toBe(ErrorConstants.INVALID_CREDENTIALS)
  })

  test('Login - Wrong password', async () => {
    const email = 'example@example.com'
    const password = 'foobar123'

    await daoUserMock.create({
      email,
      password: await CipherManager.hash(password),
      is_admin: false
    })

    const response = await request(MainApp)
      .post('/api/v1/account/login')
      .send({
        email,
        password: 'foobar'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toHaveProperty('code')
    expect(response.body.error.code).toBe(ErrorConstants.INVALID_CREDENTIALS)
  })
})