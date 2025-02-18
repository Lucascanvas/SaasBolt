'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primeiro, vamos verificar quais usuários existem
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const conversations = await queryInterface.sequelize.query(
      'SELECT id FROM "Conversations"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0 && conversations.length > 0) {
      const messages = [];
      const userIds = users.map(user => user.id);
      const conversationIds = conversations.map(conv => conv.id);

      for (let i = 0; i < 20; i++) {
        messages.push({
          content: `Mensagem de exemplo ${i + 1}`,
          senderId: userIds[i % userIds.length], // Garante que só use IDs existentes
          conversationId: conversationIds[i % conversationIds.length], // Garante que só use IDs existentes
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      if (messages.length > 0) {
        await queryInterface.bulkInsert('Messages', messages, {});
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};