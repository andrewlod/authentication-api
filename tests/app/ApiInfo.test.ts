import { describe, expect, test } from '@jest/globals'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import path from 'path'

import { MainApp } from "../../src/apps"
import { ErrorConstants } from '../../src/errors'

describe('Health Check [V1]', () => {
  test('Ping', async () => {
    const response = await request(MainApp)
      .post('/api/v1/api-info/ping')
      .send()
    
    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.text).toBe('Pong!')
  })

  test('Version', async () => {
    const packageJson = fs.readFileSync(path.join(__dirname, '../../package.json'))
    const apiVersion = JSON.parse(packageJson.toString('utf-8')).version

    const response = await request(MainApp)
      .post('/api/v1/api-info/version')
      .send()
    
      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.text).toBe(`Authentication API v${apiVersion}`)
  })

  test('Route Not Found', async () => {
    const packageJson = fs.readFileSync(path.join(__dirname, '../../package.json'))
    const apiVersion = JSON.parse(packageJson.toString('utf-8')).version

    const response = await request(MainApp)
      .post('/api/v1/api-info/this-route-does-not-exist')
      .send()
    
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toHaveProperty('code')
      expect(response.body.error.code).toBe(ErrorConstants.ROUTE_NOT_FOUND)
  })
})