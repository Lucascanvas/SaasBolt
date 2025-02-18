'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Instances', [
      {
        id: 'instance-a1',
        name: 'Instância A1',
        status: 'CONNECTED',
        workspaceId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'instance-b1',
        name: 'Instância B1',
        status: 'CONNECTED',
        workspaceId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Instances', null, {});
  }
};
