'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'text'
      },
      metadata: {
        type: Sequelize.JSONB,
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

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('Messages', ['conversationId']);
    await queryInterface.addIndex('Messages', ['senderId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Messages');
  }
}; 