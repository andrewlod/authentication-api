/**
 * SecretsConnector
 * 
 * Interface representing a strategy for fetching secret (sensitive) data
 */
interface SecretsConnector {
  /**
   * Fetches secret values from a provider
   * 
   * @param {string} secretName - Name of the secret or vault
   * @returns Map containing secret keys and their respective values
   */
  getSecretValue: (secretName: string) => Promise<Map<string, string>>
}

export default SecretsConnector
