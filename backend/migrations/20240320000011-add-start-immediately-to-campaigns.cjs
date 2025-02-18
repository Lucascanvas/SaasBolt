'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'startImmediately', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna startImmediately:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'startImmediately');
    } catch (error) {
      console.log('Erro ao remover coluna startImmediately:', error.message);
    }
  }
}; 