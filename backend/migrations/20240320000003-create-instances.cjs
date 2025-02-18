'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Instances', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('CONNECTED', 'DISCONNECTED', 'WAITING_QR', 'CONNECTING'),
        allowNull: false,
        defaultValue: 'DISCONNECTED'
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      qrcode: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      frontName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Instances');
  }
}; 