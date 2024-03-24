import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import type SecretsConnector from '../SecretsConnector'

/**
 * SecretsConnectorAWS
 * 
 * Implementation of Secrets Connector for AWS Secrets Manager
 */
class SecretsConnectorAWS implements SecretsConnector {
  client: SecretsManagerClient

  constructor () {
    this.client = new SecretsManagerClient()
  }

  /**
   * Fetches a secret com AWS Secrets Manager
   * 
   * @param {string} secretName - AWS Secrets Manager secret name
   * @returns Map containing secret keys and their respective values
   */
  async getSecretValue (secretName: string): Promise<Map<string, string>> {
    const response = await this.client.send(
      new GetSecretValueCommand({
        SecretId: secretName
      })
    )
    if (response.SecretString !== undefined) {
      const jsonObj: object = JSON.parse(response.SecretString)
      return new Map<string, string>(Object.entries(jsonObj))
    }

    if (response.SecretBinary !== undefined) {
      const jsonObj: object = JSON.parse(response.SecretBinary.toString())
      return new Map<string, string>(Object.entries(jsonObj))
    }

    return new Map<string, string>()
  }
}

export default SecretsConnectorAWS
