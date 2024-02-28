import dotenv from 'dotenv'
dotenv.config()
import { Logger } from './logging'
import { MainApp } from './apps'

const { SV_PORT } = process.env

MainApp.listen(SV_PORT, () => {
  Logger.info(`Server running on port ${SV_PORT}`)
})
