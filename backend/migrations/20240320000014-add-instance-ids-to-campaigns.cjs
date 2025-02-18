'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Campaigns', 'instanceIds', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna instanceIds:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Campaigns', 'instanceIds');
    } catch (error) {
      console.log('Erro ao remover coluna instanceIds:', error.message);
    }
  }
}; 