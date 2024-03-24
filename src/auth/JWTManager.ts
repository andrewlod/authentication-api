import type { JwtPayload } from 'jsonwebtoken'
import { sign, verify } from 'jsonwebtoken'
import { SecretManager } from '../secrets'
import { ApplicationErrorUnauthorized } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

const JWT_SECRET = SecretManager.getSecret('JWT_SECRET')
const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))

/**
 * JWTManager
 * 
 * Wrapper for JWT-managing libraries
 */
export class JWTManager {

  /**
   * Creates a JWT token
   * 
   * @param {string | Buffer | object} payload - Data to be tokenized into JWT
   * @returns JWT token
   */
  static sign (payload: string | Buffer | object): string {
    return sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_MINUTES * 60
    })
  }

  /**
   * Verifies if the provided token is valid
   * 
   * @param {string} token - JWT token to be validated
   * @returns Decoded JWT payload
   * @throws ApplicationErrorUnauthorized
   */
  static async verify (token: string): Promise<string | JwtPayload> {
    return await new Promise((resolve, reject) => {
      verify(token, JWT_SECRET, (err, payload) => {
        if (err !== null || payload === undefined) {
          reject(new ApplicationErrorUnauthorized({
            code: ErrorConstants.INVALID_AUTHORIZATION,
            details: 'The provided JWT token is invalid.'
          }, 'Invalid token.'))
          return
        }
        resolve(payload)
      })
    })
  }
}
