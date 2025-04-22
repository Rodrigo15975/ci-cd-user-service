import * as fs from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

export const secretsPath = '/mnt/secrets-store'

export type SecretKey = 'rabbit_uri' | 'db_url'

export type EnVar = 'RABBITMQ_URL' | 'DATABASE_URL'

export const readSecret = (key: SecretKey): string | null => {
  const fullPath = join(secretsPath, key)
  return fs.existsSync(fullPath)
    ? fs.readFileSync(fullPath, 'utf8').trim()
    : null
}

export const secrets: Record<SecretKey, string> = {
  rabbit_uri:
    readSecret('rabbit_uri') ??
    process.env.RABBITMQ_URL ??
    'amqp://localhost:5672',

  db_url: readSecret('db_url') ?? process.env.DATABASE_URL ?? 'default_db_url',
}
