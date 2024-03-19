import dotenv from 'dotenv'
import path from 'path'
import { SecretManager } from '../../src/secrets'

dotenv.config({
  path: path.join(__dirname, './test.env')
})

SecretManager.init('')
SecretManager.loadSecrets([])