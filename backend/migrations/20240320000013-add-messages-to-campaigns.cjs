'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'messages', {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna messages:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'messages');
    } catch (error) {
      console.log('Erro ao remover coluna messages:', error.message);
    }
  }
}; 