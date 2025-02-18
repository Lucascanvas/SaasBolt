'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'messageInterval', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 30
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna messageInterval:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'messageInterval');
    } catch (error) {
      console.log('Erro ao remover coluna messageInterval:', error.message);
    }
  }
}; 