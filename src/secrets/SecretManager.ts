import type { SecretsConnector } from '../connectors'
import { SecretsConnectorAWS } from '../connectors'
import { SecretError, SecretNotFoundError } from './SecretError'

const { NODE_ENV } = process.env

/**
 * SecretsConnectors
 * 
 * Represents the available Secret Connectors strategies
 */
export enum SecretsConnectors {
  AWS = 'AWS'
}

/**
 * SecretManager
 * 
 * Singleton class that handles fetching secrets from a strategy-defined provider
 */
export class SecretManager {
  connector: SecretsConnector | null
  secrets: Map<string, string | undefined>

  /**
   * Initializes the Secret Manager, provided the secret connector strategy
   * 
   * @param {string | undefined} connectorName - Name of the secret connector. Available connector names are defined in the `SecretsConnectors` enum
   * @throws SecretError
   */
  init (connectorName: string | undefined): void {
    if (NODE_ENV !== 'production') {
      this.connector = null
    } else if (connectorName === SecretsConnectors.AWS) {
      this.connector = new SecretsConnectorAWS()
    } else {
      throw new SecretError(`Invalid secrets connector: ${connectorName}`)
    }
  }

  /**
   * Fetches secrets from the secrets provider
   * 
   * @param {string[]} secretsList - List of strings as secret or vault names
   * @returns Promise indicating secrets have been loaded
   */
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

  /**
   * Gets all loaded secrets
   * 
   * @returns Map containing secret keys and their respective values
   */
  getSecrets (): Map<string, string | undefined> {
    return this.secrets
  }

  /**
   * Gets a single record of the loaded secrets, given a key
   * 
   * @param {string} key - Key of the given secret record
   * @returns Value stored by the given key
   * @throws SecretNotFoundError
   */
  getSecret (key: string): string {
    const value = this.secrets.get(key)

    if (value === undefined) {
      throw new SecretNotFoundError(key)
    }

    return value
  }
}

export default new SecretManager()
