'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'instanceId', {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Instances',
          key: 'id'
        }
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna instanceId:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'instanceId');
    } catch (error) {
      console.log('Erro ao remover coluna instanceId:', error.message);
    }
  }
}; 