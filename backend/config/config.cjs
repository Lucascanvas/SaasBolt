require('dotenv').config();
// Lembrar de alterar o host para o ambiente de produção: utilizando Docker host deve ser o nome do container
module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "bolt360ti",
    password: process.env.POSTGRES_PASSWORD || "kasdjasidaau1n213mmaaasdncksk",
    database: process.env.POSTGRES_DB || "campanhas360",
    host: "localhost",
    port: process.env.POSTGRES_PORT || 4001,
    dialect: "postgres",
    logging: false,
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: "localhost",
    dialect: "postgres",
    logging: false
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
