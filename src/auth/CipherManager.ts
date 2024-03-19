import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

export class CipherManager {
  static async hash (data: string | Buffer): Promise<string> {
    return await bcrypt.hash(data, PASSWORD_SALT)
  }

  static async compare (data: string | Buffer, encrypted: string): Promise<Boolean> {
    return await bcrypt.compare(data, encrypted)
  }
}