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
})