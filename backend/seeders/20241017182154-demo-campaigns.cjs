'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Não vamos criar nenhuma campanha no seed inicial
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Campaigns', null, {});
  }
};
