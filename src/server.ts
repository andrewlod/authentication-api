import dotenv from 'dotenv'
dotenv.config()
import { Logger } from './logging'
import { SecretManager } from './secrets'

const { SV_PORT, SECRETS_CONNECTOR, SECRETS_LIST } = process.env

SecretManager.init(SECRETS_CONNECTOR)
SecretManager.loadSecrets(SECRETS_LIST?.split(','))
  .then(() => {
    import('./apps')
      .then(({ MainApp }) => {
        MainApp.listen(SV_PORT, () => {
          Logger.info(`Server running on port ${SV_PORT}`)
        })
      })
      .catch(err => {
        Logger.error(`Could not load MainApp! Reason: ${err}`)
      })
  })
  .catch(err => {
    Logger.error(`Could not load secrets! Reason: ${err}`)
  })
