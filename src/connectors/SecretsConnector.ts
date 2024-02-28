interface SecretsConnector {
  getSecretValue: (secretName: string) => Promise<Map<string, string>>
}

export default SecretsConnector
