import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'campanhas360',
    process.env.POSTGRES_USER || 'bolt360ti',
    process.env.POSTGRES_PASSWORD || 'kasdjasidaau1n213mmaaasdncksk',
    {
        host: 'localhost',
        port: process.env.POSTGRES_PORT || 4001,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Testar conexão
sequelize.authenticate()
    .then(() => {
        logger.info('📊 Conexão com o banco estabelecida com sucesso!');
    })
    .catch(err => {
        logger.error('❌ Erro ao conectar com o banco:', err);
    });

export default sequelize;