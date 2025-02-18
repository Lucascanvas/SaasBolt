'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primeiro, verificar se as instâncias existem
    const instances = await queryInterface.sequelize.query(
      'SELECT id FROM "Instances"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (instances.length > 0) {
      await queryInterface.bulkInsert('Conversations', [
        {
          workspaceId: 1, // Workspace do superadmin
          name: 'Grupo A',
          type: 'GROUP',
          instanceId: 'instance-a1',
          isGroup: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          workspaceId: 1,
          name: 'Conversa Particular 1',
          type: 'PRIVATE',
          instanceId: 'instance-a1',
          isGroup: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          workspaceId: 2, // Workspace demo
          name: 'Grupo B',
          type: 'GROUP',
          instanceId: 'instance-b1',
          isGroup: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          workspaceId: 2,
          name: 'Conversa Particular 2',
          type: 'PRIVATE',
          instanceId: 'instance-b1',
          isGroup: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Conversations', null, {});
  }
};