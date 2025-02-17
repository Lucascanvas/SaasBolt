import sequelize from '../config/database.js';
import models from '../models/index.js';
import retry from 'retry';

const { User, Workspace, UserWorkspace, Campaign, MessageHistory } = models;

// Inicialização do banco de dados
async function initDatabase() {
  try {
    console.log('Verificando tabelas...');
    await sequelize.authenticate();
    console.log('Banco de dados conectado com sucesso.');

    // Sincroniza as tabelas sem apagar dados, apenas alterando quando necessário
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');

    console.log('Inicialização do banco de dados concluída.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

// Função para reconectar em caso de falha
function connectWithRetry() {
  const operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        resolve(sequelize);
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        if (operation.retry(error)) {
          console.log(`Retrying connection attempt ${currentAttempt}`);
          return;
        }
        reject(error);
      }
    });
  });
}

initDatabase();

export default connectWithRetry;
