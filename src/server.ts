import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const { SV_PORT } = process.env

const app = express()

app.get('/hello', async (_req, res) => {
  res.send('Hello, World!')
})

app.listen(SV_PORT, () => {
  console.log(`Server running on port ${SV_PORT}`)
})
