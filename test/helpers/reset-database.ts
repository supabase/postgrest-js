import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

const DB_HOST = 'localhost'
const DB_PORT = 5432
const DB_USER = 'postgres'
const DB_PASSWORD = 'postgres'
const DB_NAME = 'postgres'
const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export async function resetDatabase(): Promise<void> {
  try {
    // Reset sequences and truncate all tables
    const resetSQL = `
      -- Disable foreign key checks temporarily
      SET session_replication_role = replica;
      
      -- Truncate all tables in public schema
      TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.channels RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.messages RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.user_profiles RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.best_friends RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.collections RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.categories RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.product_categories CASCADE;
      TRUNCATE TABLE public.shops RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.cornercase RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.hotel RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.booking RESTART IDENTITY CASCADE;
      TRUNCATE TABLE public.channel_details CASCADE;
      
      -- Truncate all tables in personal schema
      TRUNCATE TABLE personal.users RESTART IDENTITY CASCADE;
      
      -- Re-enable foreign key checks
      SET session_replication_role = DEFAULT;
    `

    execSync(`psql "${DB_URL}" -c "${resetSQL.replace(/"/g, '\\"')}"`, {
      stdio: 'pipe',
    })

    // Re-insert initial data
    const dataPath = join(__dirname, '../db/01-dummy-data.sql')
    const data = readFileSync(dataPath, 'utf8')
    execSync(`psql "${DB_URL}" -c "${data.replace(/"/g, '\\"')}"`, {
      stdio: 'pipe',
    })
  } catch (error) {
    console.error('Failed to reset database:', error)
    throw error
  }
}
