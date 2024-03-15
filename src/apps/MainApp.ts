import express from 'express'
import cors from 'cors'
import { AccountRouter } from '../routers'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/account', AccountRouter)

export default app
