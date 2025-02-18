'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Conversations', [
      {
        workspaceId: 1,
        name: 'Conversa Geral',
        isGroup: true,
        type: 'GROUP',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        workspaceId: 1,
        name: 'Chat Privado',
        isGroup: false,
        type: 'PRIVATE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Conversations', null, {});
  }
};
