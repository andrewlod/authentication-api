import type { SecretsConnector } from '../connectors'
import { SecretsConnectorAWS } from '../connectors'

const { NODE_ENV } = process.env

enum SecretsConnectors {
  AWS = 'AWS'
}

class SecretManager {
  connector: SecretsConnector | null
  secrets: Map<string, string | undefined>

  init (connectorName: string | undefined): void {
    if (NODE_ENV !== 'production') {
      this.connector = null
    } else if (connectorName === SecretsConnectors.AWS) {
      this.connector = new SecretsConnectorAWS()
    } else {
      throw new Error(`Invalid secrets connector: ${connectorName}`)
    }
  }

  async loadSecrets (secretsList: string[] | undefined): Promise<void> {
    this.secrets = new Map<string, string | undefined>()
    if (secretsList === undefined) {
      return
    }

    if (this.connector === null) {
      for (const [key, value] of Object.entries(process.env)) {
        this.secrets.set(key, value)
      }
      return
    }

    for (const secretName of secretsList) {
      const values = await this.connector.getSecretValue(secretName)
      this.secrets = new Map<string, string | undefined>([...this.secrets, ...values])
    }
  }

  getSecrets (): Map<string, string | undefined> {
    return this.secrets
  }
}

export default new SecretManager()
