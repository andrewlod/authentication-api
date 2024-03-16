import type { JwtPayload } from 'jsonwebtoken'
import { sign, verify } from 'jsonwebtoken'
import { SecretManager } from '../secrets'

const JWT_SECRET = SecretManager.getSecret('JWT_SECRET')
const JWT_EXPIRE_MINUTES = parseInt(SecretManager.getSecret('JWT_EXPIRE_MINUTES'))

class JWTManager {
  sign (payload: string | Buffer | object): string {
    return sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_MINUTES * 60
    })
  }

  verify (token: string): string | JwtPayload {
    return verify(token, JWT_SECRET)
  }
}

export default new JWTManager()
