import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Logger } from './logging'

const { SV_PORT } = process.env

const app = express()

app.get('/hello', async (_req, res) => {
  res.send('Hello, World!')
})

app.listen(SV_PORT, () => {
  Logger.info(`Server running on port ${SV_PORT}`)
})
