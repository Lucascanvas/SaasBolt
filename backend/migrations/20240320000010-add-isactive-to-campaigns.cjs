'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'isActive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna isActive:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'isActive');
    } catch (error) {
      console.log('Erro ao remover coluna isActive:', error.message);
    }
  }
}; 