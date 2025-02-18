'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Adicionar successCount
      await queryInterface.addColumn('Campaigns', 'successCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });

      // Adicionar failureCount
      await queryInterface.addColumn('Campaigns', 'failureCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });

      // Adicionar error
      await queryInterface.addColumn('Campaigns', 'error', {
        type: Sequelize.TEXT,
        allowNull: true
      });

      // Adicionar lastProcessedAt
      await queryInterface.addColumn('Campaigns', 'lastProcessedAt', {
        type: Sequelize.DATE,
        allowNull: true
      });

    } catch (error) {
      console.log('Erro ao adicionar colunas:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'successCount');
      await queryInterface.removeColumn('Campaigns', 'failureCount');
      await queryInterface.removeColumn('Campaigns', 'error');
      await queryInterface.removeColumn('Campaigns', 'lastProcessedAt');
    } catch (error) {
      console.log('Erro ao remover colunas:', error.message);
    }
  }
}; 