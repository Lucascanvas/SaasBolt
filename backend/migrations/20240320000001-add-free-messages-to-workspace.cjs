'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Workspaces', 'freeMessages', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Número de mensagens gratuitas disponíveis para o workspace'
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna freeMessages:', error.message);
    }

    try {
      await queryInterface.addColumn('Workspaces', 'usedMessages', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Número de mensagens já utilizadas pelo workspace'
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna usedMessages:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Workspaces', 'freeMessages');
    } catch (error) {
      console.log('Erro ao remover coluna freeMessages:', error.message);
    }

    try {
      await queryInterface.removeColumn('Workspaces', 'usedMessages');
    } catch (error) {
      console.log('Erro ao remover coluna usedMessages:', error.message);
    }
  }
}; 