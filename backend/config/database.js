import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
    dialect: 'postgres',
    host: '20.213.21.109',
    port: 4001,
    username: 'bolt360ti',
    password: 'kasdjasidaau1n213mmaaasdncksk',
    database: 'campanhas360',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(config);

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('📊 Conexão com o banco estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        return false;
    }
};

export default sequelize;