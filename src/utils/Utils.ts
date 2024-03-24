import fs from 'fs'
import path from 'path'

interface PackageJsonWithVersion {
  version: string
}

/**
 * Gets the app version located in `package.json`
 * 
 * @returns App version in the `major`.`minor`.`patch` format
 */
export function getAppVersion (): string {
  const packageJson: PackageJsonWithVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json')).toString())
  return packageJson.version
}