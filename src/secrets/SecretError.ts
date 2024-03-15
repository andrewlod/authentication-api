export class SecretError extends Error {}
export class SecretNotFoundError extends SecretError {
  constructor (key: string) {
    super(`Secret not found: ${key}`)
  }
}
