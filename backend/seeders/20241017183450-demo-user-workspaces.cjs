'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primeiro, vamos verificar quais usuários existem
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT id FROM "Users"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingUserIds = new Set(existingUsers.map(user => user.id));

    const userWorkspaces = [];
    for (let i = 1; i < 10; i++) {  // Começando do 2 para evitar conflito com superadmin
      if (existingUserIds.has(i + 1)) {
        userWorkspaces.push({
          userId: i + 1,
          workspaceId: i < 5 ? 2 : 3,  // Usando workspaceId 2 e 3 para evitar conflito
          role: i === 1 || i === 5 ? 'admin' : 'member',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (userWorkspaces.length > 0) {
      await queryInterface.bulkInsert('UserWorkspaces', userWorkspaces, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserWorkspaces', null, {});
  }
};
