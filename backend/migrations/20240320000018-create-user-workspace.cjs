'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserWorkspaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      role: {
        type: Sequelize.ENUM('owner', 'admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
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

    // Adicionar índice composto para evitar duplicatas
    await queryInterface.addIndex('UserWorkspaces', ['userId', 'workspaceId'], {
      unique: true,
      name: 'user_workspace_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserWorkspaces');
  }
}; 