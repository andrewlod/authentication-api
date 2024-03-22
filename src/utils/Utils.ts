import fs from 'fs'
import path from 'path'

interface PackageJsonWithVersion {
  version: string
}

export function getAppVersion (): string {
  const packageJson: PackageJsonWithVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json')).toString())
  return packageJson.version
}