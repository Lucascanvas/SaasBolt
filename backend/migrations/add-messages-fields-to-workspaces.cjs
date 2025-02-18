'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Workspaces', 'availableMessages', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Workspaces', 'messagesExpiration', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Workspaces', 'availableMessages');
    await queryInterface.removeColumn('Workspaces', 'messagesExpiration');
  }
}; 