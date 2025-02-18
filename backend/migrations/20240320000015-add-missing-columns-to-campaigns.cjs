'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Adicionar scheduledTo
      await queryInterface.addColumn('Campaigns', 'scheduledTo', {
        type: Sequelize.DATE,
        allowNull: true
      });

      // Adicionar csvFileUrl
      await queryInterface.addColumn('Campaigns', 'csvFileUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });

      // Adicionar imageUrl
      await queryInterface.addColumn('Campaigns', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });

      // Adicionar startDate
      await queryInterface.addColumn('Campaigns', 'startDate', {
        type: Sequelize.DATE,
        allowNull: true
      });

      // Adicionar type
      await queryInterface.addColumn('Campaigns', 'type', {
        type: Sequelize.STRING,
        allowNull: true
      });

    } catch (error) {
      console.log('Erro ao adicionar colunas:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'scheduledTo');
      await queryInterface.removeColumn('Campaigns', 'csvFileUrl');
      await queryInterface.removeColumn('Campaigns', 'imageUrl');
      await queryInterface.removeColumn('Campaigns', 'startDate');
      await queryInterface.removeColumn('Campaigns', 'type');
    } catch (error) {
      console.log('Erro ao remover colunas:', error.message);
    }
  }
}; 