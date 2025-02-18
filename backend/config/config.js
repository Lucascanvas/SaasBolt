require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DATABASE_PROVIDER || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DATABASE_PROVIDER || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DATABASE_PROVIDER || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres',
    logging: false
  }
}; 