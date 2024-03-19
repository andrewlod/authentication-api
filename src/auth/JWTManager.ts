import type { JwtPayload } from 'jsonwebtoken'
import { sign, verify } from 'jsonwebtoken'
import { SecretManager } from '../secrets'
import { ApplicationErrorUnauthorized } from '../errors/ApplicationError'
import { ErrorConstants } from '../errors'

const JWT_SECRET = SecretManager.getSecret('JWT_SECRET')
const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))

export class JWTManager {
  static sign (payload: string | Buffer | object): string {
    return sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_MINUTES * 60
    })
  }

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
