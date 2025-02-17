require('dotenv').config();
// Lembrar de alterar o host para o ambiente de produção: utilizando Docker host deve ser o nome do container
module.exports = {
  development: {
    username: 'bolt360ti',
    password: 'kasdjasidaau1n213mmaaasdncksk',
    database: 'campanhas360',
    host: '20.213.21.109',
    port: 4001,
    dialect: 'postgres'
  },
  test: {
    username: 'bolt360ti',
    password: 'kasdjasidaau1n213mmaaasdncksk',
    database: 'campanhas360',
    host: '20.213.21.109',
    port: 4001,
    dialect: 'postgres'
  },
  production: {
    username: 'bolt360ti',
    password: 'kasdjasidaau1n213mmaaasdncksk',
    database: 'campanhas360',
    host: '20.213.21.109',
    port: 4001,
    dialect: 'postgres'
  }
};
