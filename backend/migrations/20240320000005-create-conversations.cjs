'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lastMessageAt: {
        type: Sequelize.DATE
      },
      groupProfilePhoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('GROUP', 'PRIVATE'),
        allowNull: false,
        defaultValue: 'PRIVATE'
      },
      instanceId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Instances',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations');
  }
}; 