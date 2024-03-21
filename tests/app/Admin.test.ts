import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
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
import { ErrorConstants } from '../../src/errors'
import { CipherManager } from '../../src/auth'
import { expectExistingEmailError, expectInvalidBody } from '../helper/TestHelper'

describe('Admin Controller [V1]', () => {
  const USER_EMAIL = 'example@example.com'
  const USER_PASSWORD = 'foobar123'
  let USER_TOKEN

  test('No token', async () => {
    const response = await request(MainApp)
      .delete('/api/v1/admin/users/1')
      .send()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toHaveProperty('code')
    expect(response.body.error.code).toBe(ErrorConstants.MISSING_AUTHORIZATION)
  })
  
  describe('Admin User', () => {
    beforeEach(async () => {
      await daoUserMock.create({
        email: USER_EMAIL,
        password: await CipherManager.hash(USER_PASSWORD),
        is_admin: true
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
    
    test('Update User - Success', async () => {
      const newPassword = 'barfoo321'
  
      const response = await request(MainApp)
        .put('/api/v1/admin/users/1')
        .send({
          password: newPassword
        })
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('User successfully updated.')
  
      const registeredUser = await daoUserMock.findById(1)
      expect(registeredUser?.email).toBe(USER_EMAIL)
      expect(await CipherManager.compare(newPassword, registeredUser?.password as string)).toBe(true)
      expect(registeredUser?.is_admin).toBe(true)
    })

    test('Update User - Invalid email', async () => {
      const newEmail = 'anInvalidEmail'
  
      const response = await request(MainApp)
        .put('/api/v1/admin/users/1')
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
        .put('/api/v1/admin/users/1')
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
        .put('/api/v1/admin/users/1')
        .send({
          password: newPassword
        })
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expectInvalidBody(response)
    })
    
    test('Get All Users - Success', async () => {
      const response = await request(MainApp)
        .get('/api/v1/admin/users')
        .send()
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('Users successfully fetched.')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('users')
      expect(response.body.data.users).toHaveLength(1)
    })
    
    test('Get One User - Success', async () => {
      const response = await request(MainApp)
        .get('/api/v1/admin/users/1')
        .send()
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('User successfully fetched.')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('user')

      expect(response.body.data.user).toHaveProperty('id')
      expect(response.body.data.user).toHaveProperty('email')
      expect(response.body.data.user).toHaveProperty('is_admin')
      expect(response.body.data.user).not.toHaveProperty('password')
    })
    
    test('Get One User - Not Found', async () => {
      const response = await request(MainApp)
        .get('/api/v1/admin/users/2')
        .send()
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toHaveProperty('code')
      expect(response.body.error.code).toBe(ErrorConstants.USER_NOT_FOUND)
    })
    
    test('Delete User - Success', async () => {
      const response = await request(MainApp)
        .delete('/api/v1/admin/users/1')
        .send()
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('User successfully deleted.')
    })
    
    test('Delete User - Not Found', async () => {
      const response = await request(MainApp)
        .delete('/api/v1/admin/users/2')
        .send()
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveProperty('code')
        expect(response.body.error.code).toBe(ErrorConstants.USER_NOT_FOUND)
    })
  })

  describe('Not an Admin User', () => {
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
    
    test('Unauthorized', async () => {
      const newPassword = 'barfoo321'
  
      const response = await request(MainApp)
        .put('/api/v1/admin/users/1')
        .send({
          password: newPassword
        })
        .set('Authorization', USER_TOKEN)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toHaveProperty('code')
      expect(response.body.error.code).toBe(ErrorConstants.NOT_ENOUGH_PRIVILEGES)
    })
  })
})