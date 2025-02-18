'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      startImmediately: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      messageInterval: {
        type: Sequelize.INTEGER,
        defaultValue: 30
      },
      messages: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      instanceIds: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'PENDING'
      },
      successCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      failureCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      lastProcessedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      scheduledTo: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Campaigns');
  }
}; 