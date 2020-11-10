const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env

export const dbOptions = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  connectionTimeoutMillis: 5000,
}
