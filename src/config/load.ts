import * as fs from 'fs'
import { join } from 'path'
import { EnVar, SecretKey, secrets, secretsPath } from './secrets/secrets.env'
import { Logger } from '@nestjs/common'

const logger = new Logger('LoadMountSecrets')

const injectSecretToEnv = (filename: SecretKey, envVar: EnVar) => {
  const fullPath = join(secretsPath, filename)
  if (fs.existsSync(fullPath)) {
    process.env[envVar] = fs.readFileSync(fullPath, 'utf8').trim()
  }
}

export const LoadSecrets = () => {
  const missingSecrets = Object.entries(secrets).filter(([, value]) =>
    value?.startsWith('default_'),
  )

  if (missingSecrets.length > 0)
    logger.warn(
      'No se encontraron algunos secretos montados, usando valores por defecto o variables de entorno.',
    )

  logger.log('Secrets loaded successfully.', { secrets, missingSecrets })
}

injectSecretToEnv('rabbit_uri', 'RABBITMQ_URL')
injectSecretToEnv('db_url', 'DATABASE_URL')
