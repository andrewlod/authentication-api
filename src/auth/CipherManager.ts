import bcrypt from 'bcrypt'
import { SecretManager } from '../secrets'

const PASSWORD_SALT = parseInt(SecretManager.getSecret('PASSWORD_SALT'))

/**
 * CipherManager
 * 
 * Wrapper for encryption and hashing libraries, such as BCrypt.
 */
export class CipherManager {

  /**
   * Creates a hash of the given data
   * 
   * @param {string | Buffer} data - Data to be hashed
   * @returns Promise containing the hashed version of the data
   */
  static async hash (data: string | Buffer): Promise<string> {
    return await bcrypt.hash(data, PASSWORD_SALT)
  }

  /**
   * Compares data as plain text with a hash.
   * 
   * @param {string | Buffer} data - Plain text data
   * @param {string} encrypted - Hashed data to be compared to
   * @returns Promise containing a flag whether the data corresponds to the hashed value or not
   */
  static async compare (data: string | Buffer, encrypted: string): Promise<Boolean> {
    return await bcrypt.compare(data, encrypted)
  }
}